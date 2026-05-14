"use client"

import { useState } from "react"
import { ThumbsDown, Heart, BadgeCheck, MapPin, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Job {
  id: string
  title: string
  postedAt: string
  proposals: string
  type: "Fixed-price" | "Hourly"
  level: "Entry" | "Intermediate" | "Expert"
  budget?: string
  hourlyRange?: string
  duration?: string
  description: string
  skills: string[]
  paymentVerified: boolean
  rating: number
  spend: string
  country: string
}

export function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <article className="border-b border-border py-6 transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Posted {job.postedAt} <span className="mx-1">•</span> Proposals: {job.proposals}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Not interested"
          >
            <ThumbsDown className="size-4" />
          </button>
          <button
            onClick={() => setSaved((v) => !v)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border border-border hover:bg-muted",
              saved ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={saved ? "Unsave job" : "Save job"}
          >
            <Heart className={cn("size-4", saved && "fill-current")} />
          </button>
        </div>
      </div>

      <h3 className="mt-2 text-pretty text-lg font-semibold leading-snug hover:text-primary md:text-xl">
        <a href={`/jobs/${job.id}`}>{job.title}</a>
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{job.type}</span>
        {" - "}
        {job.level}
        {job.budget && ` - Est. Budget: ${job.budget}`}
        {job.hourlyRange && ` ${job.hourlyRange}`}
        {job.duration && ` - Est. Time: ${job.duration}`}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/80">{job.description}</p>
      <button className="mt-1 text-sm font-medium underline-offset-4 hover:underline">more</button>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {job.paymentVerified && (
          <div className="inline-flex items-center gap-1.5">
            <BadgeCheck className="size-4 fill-primary text-primary-foreground" />
            <span className="text-foreground/80">Payment verified</span>
          </div>
        )}
        <div className="inline-flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < Math.floor(job.rating) ? "fill-orange-400 text-orange-400" : "text-muted",
              )}
            />
          ))}
        </div>
        <span className="font-medium">{job.spend} spent</span>
        <div className="inline-flex items-center gap-1 text-foreground/80">
          <MapPin className="size-4" />
          {job.country}
        </div>
      </div>
    </article>
  )
}
