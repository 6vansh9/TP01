"use client"

import { useState } from "react"
import { Star, Bookmark, MessageSquare, ExternalLink, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export interface Proposal {
  id: string
  freelancer: {
    id: string
    name: string
    title: string
    avatarUrl: string
    isOnline: boolean
    rating: number
    reviewCount: number
    isTopRated: boolean
  }
  proposedRate: string
  deliveryTime: string
  coverLetter: string
  skills: string[]
  matchingSkills: string[]
  isShortlisted: boolean
}

interface ProposalCardProps {
  proposal: Proposal
  onShortlist: (id: string) => void
  onMessage: (id: string) => void
  onViewProfile: (id: string) => void
  onHire: (proposal: Proposal) => void
  className?: string
}

export function ProposalCard({
  proposal,
  onShortlist,
  onMessage,
  onViewProfile,
  onHire,
  className,
}: ProposalCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [shortlisted, setShortlisted] = useState(proposal.isShortlisted)

  const handleShortlist = () => {
    setShortlisted(!shortlisted)
    onShortlist(proposal.id)
  }

  return (
    <article
      className={cn(
        "group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-4">
        {/* Avatar with online badge */}
        <div className="relative shrink-0">
          <Avatar className="size-14">
            <AvatarImage src={proposal.freelancer.avatarUrl} alt={proposal.freelancer.name} />
            <AvatarFallback className="text-lg font-medium">
              {proposal.freelancer.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          {proposal.freelancer.isOnline && (
            <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-card bg-emerald-500" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-foreground">
              {proposal.freelancer.name}
            </h3>
            {proposal.freelancer.isTopRated && (
              <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Award className="size-3" />
                Top Rated
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground truncate">
            {proposal.freelancer.title}
          </p>
          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.floor(proposal.freelancer.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              {proposal.freelancer.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({proposal.freelancer.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Rate + Delivery */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-foreground">{proposal.proposedRate}</p>
          <p className="text-sm text-muted-foreground">{proposal.deliveryTime}</p>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="mt-4">
        <p className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          !expanded && "line-clamp-3"
        )}>
          {proposal.coverLetter}
        </p>
        {proposal.coverLetter.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-sm font-medium text-primary hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {proposal.skills.map((skill) => {
          const isMatching = proposal.matchingSkills.includes(skill)
          return (
            <span
              key={skill}
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                isMatching
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {skill}
            </span>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShortlist}
          className={cn(
            "gap-1.5",
            shortlisted && "text-primary"
          )}
        >
          <Bookmark className={cn("size-4", shortlisted && "fill-current")} />
          {shortlisted ? "Shortlisted" : "Shortlist"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMessage(proposal.id)}
          className="gap-1.5"
        >
          <MessageSquare className="size-4" />
          Message
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProfile(proposal.freelancer.id)}
          className="gap-1.5"
        >
          <ExternalLink className="size-4" />
          View Profile
        </Button>
        <Button
          size="sm"
          onClick={() => onHire(proposal)}
          className="ml-auto"
        >
          Hire
        </Button>
      </div>
    </article>
  )
}

export function ProposalCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2 text-right">
          <Skeleton className="ml-auto h-6 w-20" />
          <Skeleton className="ml-auto h-4 w-16" />
        </div>
      </div>

      {/* Cover Letter */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Skills */}
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="ml-auto h-8 w-16" />
      </div>
    </div>
  )
}
