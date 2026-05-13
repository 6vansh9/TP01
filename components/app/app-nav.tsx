"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, Search, HelpCircle, Bell, Globe, Menu, X, ExternalLink } from "lucide-react"
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
  { label: "Find work", href: "/jobs" },
  { label: "Saved jobs", href: "/jobs?tab=saved" },
  { label: "Proposals and offers", href: "/proposals" },
]

const reachMoreMenu = [
  { label: "Your services", href: "/services" },
  { label: "Promote with ads", href: "/ads", external: true },
  { label: "Direct Contracts", href: "/direct-contracts" },
]

const deliverWorkMenu = [
  { label: "Your active contracts", href: "/contracts" },
  { label: "Contract history", href: "/contracts/history" },
  { label: "Hourly work diary", href: "/work-diary" },
]

const financesMenu = [
  { label: "Financial overview", href: "/finances" },
  { label: "Your reports", href: "/finances/reports" },
  { label: "Billings and earnings", href: "/finances/earnings" },
  { label: "Transactions", href: "/finances/transactions" },
  { label: "Certificate of earnings", href: "/finances/certificate", external: true },
]

const paymentsMenu = [
  { label: "Withdraw earnings", href: "/finances/withdraw" },
]

const taxesMenu = [
  { label: "Tax forms", href: "/finances/taxes" },
]

export function AppNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 md:gap-4 md:px-8">
        <UpworkLogo />

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {/* Find work dropdown */}
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
                  <Link href={item.href} className="flex items-center justify-between">
                    {item.label}
                    {item.external && <ExternalLink className="size-3 opacity-60" />}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Deliver work dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              Deliver work
              <ChevronDown className="size-4 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {deliverWorkMenu.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Manage finances dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              Manage finances
              <ChevronDown className="size-4 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {financesMenu.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="flex items-center justify-between">
                    {item.label}
                    {item.external && <ExternalLink className="size-3 opacity-60" />}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Payments</DropdownMenuLabel>
              {paymentsMenu.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Taxes</DropdownMenuLabel>
              {taxesMenu.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
                <Image
                  src="/avatar-vansh.jpg"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile">Your profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
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
          <Link href="/jobs" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Find work
          </Link>
          <Link href="/jobs?tab=saved" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Saved jobs
          </Link>
          <Link href="/proposals" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Proposals and offers
          </Link>
          <div className="my-2 h-px bg-border" />
          <Link href="/contracts" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Your active contracts
          </Link>
          <Link href="/contracts/history" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Contract history
          </Link>
          <Link href="/work-diary" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Hourly work diary
          </Link>
          <div className="my-2 h-px bg-border" />
          <Link href="/finances" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Financial overview
          </Link>
          <Link href="/finances/earnings" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Billings and earnings
          </Link>
          <Link href="/finances/withdraw" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Withdraw earnings
          </Link>
          <div className="my-2 h-px bg-border" />
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
