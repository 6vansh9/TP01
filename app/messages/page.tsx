"use client"
import { useEffect, useState, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { AppNav } from "@/components/app/app-nav"
import { Send, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  job_id: string
  client_id: string
  freelancer_id: string
  job_title: string
  other_name: string
  other_id: string
  last_message?: string
  last_time?: string
}

type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      setCurrentUser({ id: user.id, role: profile?.role ?? "freelancer" })

      const { data: convs } = await supabase
        .from("conversations")
        .select("id, job_id, client_id, freelancer_id, jobs(title), created_at")
        .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
        .order("created_at", { ascending: false })

      if (!convs?.length) { setLoading(false); return }

      const otherIds = convs.map(c => c.client_id === user.id ? c.freelancer_id : c.client_id)
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", otherIds)
      const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.full_name]))

      const formatted: Conversation[] = convs.map(c => ({
        id: c.id,
        job_id: c.job_id,
        client_id: c.client_id,
        freelancer_id: c.freelancer_id,
        job_title: (c.jobs as any)?.title ?? "Job",
        other_id: c.client_id === user.id ? c.freelancer_id : c.client_id,
        other_name: profileMap[c.client_id === user.id ? c.freelancer_id : c.client_id] ?? "User",
      }))

      setConversations(formatted)
      setActiveConv(formatted[0])
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (!activeConv) return
    loadMessages(activeConv.id)

    const sub = supabase.channel(`messages:${activeConv.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${activeConv.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
      })
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [activeConv])

  async function loadMessages(convId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
    setMessages(data ?? [])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  async function sendMessage() {
    if (!input.trim() || !activeConv || !currentUser) return
    const content = input.trim()
    setInput("")
    await supabase.from("messages").insert({
      conversation_id: activeConv.id,
      sender_id: currentUser.id,
      content,
    })
  }

  const filtered = conversations.filter(c =>
    c.other_name.toLowerCase().includes(search.toLowerCase()) ||
    c.job_title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppNav />
      <div className="flex flex-1 overflow-hidden border-t border-border">
        {/* Sidebar */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-muted border-0 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No conversations yet.</div>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors",
                    activeConv?.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary shrink-0">
                      {conv.other_name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{conv.other_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.job_title}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        {activeConv ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                {activeConv.other_name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{activeConv.other_name}</p>
                <p className="text-xs text-muted-foreground">{activeConv.job_title}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-muted-foreground text-sm">No messages yet. Say hello!</p>
                  </div>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === currentUser?.id
                  return (
                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}>
                        <p>{msg.content}</p>
                        <p className={cn("text-[10px] mt-1", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-semibold text-lg mb-1">Welcome to Messages</h3>
              <p className="text-muted-foreground text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
