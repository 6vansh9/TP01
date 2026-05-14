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

export function AppNav() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState("?")

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from("profiles").select("avatar_url, full_name").eq("id", user.id).single()
      if (data?.avatar_url) setAvatarUrl(data.avatar_url)
      if (data?.full_name) setInitials(data.full_name[0]?.toUpperCase() ?? "?")
    }
    load()
  }, [])
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 md:gap-4 md:px-8">
        <UpworkLogo />

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
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
          <Link href="/messages" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Messages
          </Link>
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
          <button
            className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          </button>
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
          <Link href="/find-work" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Find work
          </Link>
          <Link href="/proposals" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Proposals and offers
          </Link>
          <Link href="/messages" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Messages
          </Link>
          <Link href="/profile" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}
