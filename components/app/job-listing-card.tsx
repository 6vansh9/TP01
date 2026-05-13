"use client"

import { useState } from "react"
import { Bookmark, BadgeCheck, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface JobListing {
  id: string
  title: string
  postedAt: string
  location: string
  verified: boolean
  description: string
  skills: string[]
  budget: string
  projectType: "Fixed Price" | "Hourly"
  skillMatch?: number
  proposalCount: number
  isLive?: boolean
}

interface JobListingCardProps {
  job: JobListing
  className?: string
}

export function JobListingCard({ job, className }: JobListingCardProps) {
  const [saved, setSaved] = useState(false)

  return (
    <article
      className={cn(
        "group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{job.postedAt}</span>
          <span className="size-1 rounded-full bg-muted-foreground/50" />
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {job.location}
          </span>
          {job.verified && (
            <>
              <span className="size-1 rounded-full bg-muted-foreground/50" />
              <span className="flex items-center gap-1 text-primary">
                <BadgeCheck className="size-3.5 fill-primary text-primary-foreground" />
                Verified
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors",
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
          )}
          aria-label={saved ? "Remove from saved" : "Save job"}
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </button>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-pretty text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        <a href="#" className="hover:underline">
          {job.title}
        </a>
      </h3>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {job.description}
      </p>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        {/* Budget */}
        <span className="text-base font-bold text-foreground">{job.budget}</span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {job.projectType}
        </span>

        {/* Skill Match Badge */}
        {job.skillMatch && (
          <div className="relative ml-auto flex items-center gap-2">
            {/* Glowing ring */}
            <div className="relative flex items-center justify-center">
              <svg className="skill-match-glow size-10" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${(job.skillMatch / 100) * 97.5} 97.5`}
                  transform="rotate(-90 18 18)"
                  className="text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-emerald-500">
                {job.skillMatch}%
              </span>
            </div>
            <span className="text-xs font-medium text-emerald-500">Skill Match</span>
          </div>
        )}

        {/* Proposal Count with Live Indicator */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {job.isLive && (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
          )}
          <span>{job.proposalCount} proposals</span>
        </div>
      </div>
    </article>
  )
}

export function JobListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="size-8 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="mt-3 h-6 w-3/4" />

      {/* Description */}
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Skills */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="ml-auto size-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}
