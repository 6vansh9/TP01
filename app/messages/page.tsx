"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AppNav } from "@/components/app/app-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  MoreHorizontal, 
  SlidersHorizontal, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile,
  Check,
  CheckCheck,
  Phone,
  Video,
  Info
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  jobTitle?: string
}

interface Message {
  id: string
  senderId: string
  text: string
  time: string
  read: boolean
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the update! The design looks great.",
    time: "2m ago",
    unread: 2,
    online: true,
    jobTitle: "Website Redesign Project"
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we schedule a call to discuss the API?",
    time: "1h ago",
    unread: 0,
    online: true,
    jobTitle: "E-commerce App Development"
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I have submitted the milestone for review.",
    time: "3h ago",
    unread: 0,
    online: false,
    jobTitle: "Logo Design"
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfect, I will start working on it tomorrow.",
    time: "Yesterday",
    unread: 0,
    online: false,
    jobTitle: "Mobile App UI/UX"
  },
]

const messages: Message[] = [
  {
    id: "1",
    senderId: "other",
    text: "Hi! I saw your proposal for the website redesign project. Your portfolio looks impressive!",
    time: "10:30 AM",
    read: true
  },
  {
    id: "2",
    senderId: "me",
    text: "Thank you! I am really excited about this project. I have some ideas I would like to share with you.",
    time: "10:32 AM",
    read: true
  },
  {
    id: "3",
    senderId: "other",
    text: "That sounds great! What are you thinking?",
    time: "10:33 AM",
    read: true
  },
  {
    id: "4",
    senderId: "me",
    text: "I was thinking we could use a modern, minimalist approach with a focus on user experience. I can create some wireframes to show you.",
    time: "10:35 AM",
    read: true
  },
  {
    id: "5",
    senderId: "other",
    text: "Thanks for the update! The design looks great.",
    time: "10:40 AM",
    read: true
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <div className={cn(
          "w-full border-r border-border bg-background md:w-80 lg:w-96",
          selectedConversation && "hidden md:block"
        )}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark all as read</DropdownMenuItem>
                <DropdownMenuItem>Archive all</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="size-10">
              <SlidersHorizontal className="size-4" />
            </Button>
          </div>

          {/* Conversations List */}
          <ScrollArea className="h-[calc(100vh-64px-120px)]">
            {filteredConversations.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      selectedConversation?.id === conv.id && "bg-muted"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="size-12">
                        <AvatarImage src={conv.avatar} alt={conv.name} />
                        <AvatarFallback>{conv.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{conv.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      {conv.jobTitle && (
                        <p className="truncate text-xs text-muted-foreground">{conv.jobTitle}</p>
                      )}
                      <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-sm text-muted-foreground">Conversations will appear here</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col",
          !selectedConversation && "hidden md:flex"
        )}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <div className="relative">
                    <Avatar className="size-10">
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                      <AvatarFallback>{selectedConversation.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium">{selectedConversation.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-9">
                    <Phone className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-9">
                    <Video className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-9">
                    <Info className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="mx-auto max-w-3xl space-y-4">
                  {/* Job context */}
                  {selectedConversation.jobTitle && (
                    <div className="mx-auto mb-6 max-w-md rounded-lg border border-border bg-muted/30 p-3 text-center">
                      <p className="text-xs text-muted-foreground">Conversation about</p>
                      <p className="font-medium">{selectedConversation.jobTitle}</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.senderId === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2",
                          message.senderId === "me"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-xs",
                          message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          <span>{message.time}</span>
                          {message.senderId === "me" && (
                            message.read ? <CheckCheck className="size-3" /> : <Check className="size-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="mx-auto flex max-w-3xl items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-10 shrink-0">
                    <Paperclip className="size-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type a message..."
                      className="pr-10"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 size-8 -translate-y-1/2">
                      <Smile className="size-4" />
                    </Button>
                  </div>
                  <Button size="icon" className="size-10 shrink-0">
                    <Send className="size-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <div className="mb-6 text-muted-foreground">
                <MessageSquare className="mx-auto size-16 stroke-1" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-muted-foreground">Welcome to Messages</h2>
              <p className="mb-6 max-w-md text-center text-muted-foreground">
                Once you connect with a client, you&apos;ll be able to chat and collaborate here
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/jobs">Search for jobs</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
