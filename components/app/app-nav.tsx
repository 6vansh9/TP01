"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { ChevronDown, Search, HelpCircle, Bell, Globe, Menu, X } from "lucide-react"
import { UpworkLogo } from "@/components/upwork-logo"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const findWorkMenu = [
  { label: "Find work", href: "/find-work" },
  { label: "Saved jobs", href: "/find-work/saved" },
  { label: "Proposals and offers", href: "/proposals" },
]

const reachMoreMenu = [
  { label: "Your services", href: "/services" },
  { label: "Promote with ads", href: "/ads", external: true },
  { label: "Direct Contracts", href: "/direct-contracts" },
]

// notification types added above
export function AppNav() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState("?")
  const [role, setRole] = useState<"client" | "freelancer" | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from("profiles").select("avatar_url, full_name, role").eq("id", user.id).single()
      if (data?.avatar_url) setAvatarUrl(data.avatar_url)
      if (data?.full_name) setInitials(data.full_name[0]?.toUpperCase() ?? "?")
      if (data?.role) setRole(data.role as "client" | "freelancer")
    }
    load()
  }, [])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState<{id:string,title:string,message:string,read:boolean,link:string|null,created_at:string}[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    async function loadNotifs() {
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)
      setNotifications(data ?? [])
    }
    loadNotifs()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 md:gap-4 md:px-8">
        <UpworkLogo />

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {role === "client" ? (
            <>
              <Link href="/post-job" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Post a Job
              </Link>
              <Link href="/dashboard/client" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                My Jobs
              </Link>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                  Find work
                  <ChevronDown className="size-4 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {findWorkMenu.map((item) => (
                    <DropdownMenuItem key={item.label} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Reach more clients</DropdownMenuLabel>
                  {reachMoreMenu.map((item) => (
                    <DropdownMenuItem key={item.label} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Deliver work
                <ChevronDown className="size-4 opacity-60" />
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Manage finances
                <ChevronDown className="size-4 opacity-60" />
              </button>
            </>
          )}
          <Link href="/messages" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Messages
          </Link>
          {role && (
            <Link href={role === "client" ? "/dashboard/client" : "/dashboard/freelancer"} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-background pl-4 md:flex">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="w-40 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="h-6 w-px bg-border" />
            <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium">
              Jobs
              <ChevronDown className="size-4 opacity-60" />
            </button>
          </div>

          <button
            className="hidden size-10 items-center justify-center rounded-full hover:bg-muted md:inline-flex"
            aria-label="Help"
          >
            <HelpCircle className="size-5" />
          </button>
          <DropdownMenu open={showNotifs} onOpenChange={setShowNotifs}>
            <DropdownMenuTrigger asChild>
              <button className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted" aria-label="Notifications">
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unreadCount}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No notifications yet</div>
              ) : (
                notifications.map(n => (
                  <DropdownMenuItem key={n.id} asChild>
                    <a href={n.link ?? "#"} className={cn("flex flex-col gap-1 px-3 py-2.5 cursor-pointer", !n.read && "bg-primary/5")}>
                      <span className="font-medium text-sm">{n.title}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{n.message}</span>
                    </a>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            className="hidden size-10 items-center justify-center rounded-full hover:bg-muted md:inline-flex"
            aria-label="Language"
          >
            <Globe className="size-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="size-10 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-primary">
                {avatarUrl ? <img src={avatarUrl} alt="Profile" className="size-full object-cover" /> : <span className="flex size-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary">{initials}</span>}







              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile">Your profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Log out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="inline-flex size-10 items-center justify-center rounded-md lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border bg-background lg:hidden", mobileOpen ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-3">
          {role === "client" ? (
            <>
              <Link href="/post-job" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Post a Job
              </Link>
              <Link href="/dashboard/client" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                My Jobs
              </Link>
            </>
          ) : (
            <>
              <Link href="/find-work" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Find work
              </Link>
              <Link href="/proposals" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Proposals and offers
              </Link>
            </>
          )}
          <Link href="/messages" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Messages
          </Link>
          {role && (
            <Link href={role === "client" ? "/dashboard/client" : "/dashboard/freelancer"} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              Dashboard
            </Link>
          )}
          <Link href="/profile" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}
