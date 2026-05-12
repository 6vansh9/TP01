"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, Pencil, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-background p-6", className)}>{children}</div>
  )
}

function CollapsibleCard({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-base font-semibold">{title}</h3>
        {open ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  )
}

function RowEdit({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{value}</p>
      </div>
      <button
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary/5"
        aria-label={`Edit ${label}`}
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  )
}

export function FindWorkRail() {
  return (
    <aside className="flex flex-col gap-4">
      {/* Profile */}
      <Card>
        <div className="flex items-center gap-4">
          <Image
            src="/avatar-vansh.jpg"
            alt="Vansh A."
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
          />
          <div className="min-w-0">
            <Link href="/profile" className="text-base font-semibold hover:underline">
              Vansh A.
            </Link>
            <p className="truncate text-sm text-muted-foreground">Other - Software Devel…</p>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/profile" className="text-sm font-medium text-primary hover:underline">
            Complete your profile
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={90} className="h-1.5 flex-1" />
            <span className="text-xs font-medium text-muted-foreground">90%</span>
          </div>
        </div>
      </Card>

      {/* Identity verification */}
      <Card>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent">
            <svg viewBox="0 0 24 24" className="size-4 text-accent-foreground" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="11" r="2" />
              <path d="M14 10h4M14 14h4M5 17c0-1.5 2-3 4-3s4 1.5 4 3" />
            </svg>
          </div>
          <h3 className="text-base font-semibold">Identity verification</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Increase your profile visibility in search results and win more work with an IDV Badge.
        </p>
        <Link href="#" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Get an IDV Badge
        </Link>
      </Card>

      {/* Promote with ads */}
      <CollapsibleCard title="Promote with ads" defaultOpen>
        <div className="flex flex-col gap-4">
          <RowEdit label="Availability badge" value="Off" />
          <RowEdit label="Boost your profile" value="Off" />
        </div>
      </CollapsibleCard>

      {/* Connects */}
      <CollapsibleCard title="Connects: 0" defaultOpen>
        <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/5">
          Buy Connects
        </Button>
        <Link href="#" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          View details
        </Link>
      </CollapsibleCard>

      {/* Preferences */}
      <CollapsibleCard title="Preferences" />
      <CollapsibleCard title="Proposals" />
      <CollapsibleCard title="Project Catalog" />

      {/* Quick links */}
      <Card>
        <div className="flex flex-col gap-3 text-sm font-semibold text-primary">
          <Link href="#" className="inline-flex items-center gap-1 hover:underline">
            Direct Contracts
            <ExternalLink className="size-3.5" />
          </Link>
          <Link href="#" className="inline-flex items-center gap-1 hover:underline">
            Withdrawals
            <ExternalLink className="size-3.5" />
          </Link>
          <Link href="#" className="inline-flex items-center gap-1 hover:underline">
            Help Center
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </Card>
    </aside>
  )
}
