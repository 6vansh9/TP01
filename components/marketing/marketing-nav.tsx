"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, Search, Menu, X, Bell, HelpCircle, Globe } from "lucide-react"
import { UpworkLogo } from "@/components/upwork-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { label: "Hire talent", hasMenu: true },
  { label: "Get outcomes", hasMenu: true },
  { label: "Find work", hasMenu: true },
  { label: "Why Upwork", hasMenu: true },
  { label: "Pricing", hasMenu: false, href: "/pricing" },
  { label: "Enterprise", hasMenu: false, href: "/enterprise" },
]

export function MarketingNav({ mode = "hire" }: { mode?: "hire" | "work" }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isLoggedIn, isLoading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 md:px-8">
        <UpworkLogo />

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
              {item.hasMenu && <ChevronDown className="size-4 opacity-60" />}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2 lg:flex">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={mode === "hire" ? "Search for talent" : "Search for jobs"}
              className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Show Login/Signup when NOT logged in */}
          {!isLoading && !isLoggedIn && (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted md:inline-flex"
              >
                Log in
              </Link>

              <Button asChild className="hidden rounded-full bg-primary px-5 font-medium md:inline-flex">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}

          {/* Show user controls when logged in */}
          {!isLoading && isLoggedIn && (
            <>
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
                    <Image
                      src={user?.avatar || "/avatar-vansh.jpg"}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/jobs">Find work</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contracts">My contracts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages">Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Your profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <button
            className="inline-flex size-10 items-center justify-center rounded-md lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-background lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-muted"
            >
              {item.label}
              {item.hasMenu && <ChevronDown className="size-4 opacity-60" />}
            </button>
          ))}
          
          {/* Mobile: Show Login/Signup when NOT logged in */}
          {!isLoading && !isLoggedIn && (
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Log in
              </Link>
              <Button asChild className="w-full rounded-full">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile: Show user options when logged in */}
          {!isLoading && isLoggedIn && (
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3">
              <Link href="/jobs" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Find work
              </Link>
              <Link href="/contracts" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                My contracts
              </Link>
              <Link href="/messages" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Messages
              </Link>
              <Link href="/profile" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Profile
              </Link>
              <button
                onClick={logout}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted"
              >
                Log out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
