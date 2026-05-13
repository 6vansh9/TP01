import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FeaturedFreelancer } from "@/lib/data/home-page"
import { cn } from "@/lib/utils"

function StarRow({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)))
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < full ? "fill-orange-400 text-orange-400" : "text-muted")}
        />
      ))}
    </div>
  )
}

function initials(name: string | null) {
  if (!name?.trim()) return "?"
  const parts = name.trim().split(/\s+/)
  const a = parts[0]?.[0]
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
  return `${a ?? ""}${b ?? ""}`.toUpperCase() || "?"
}

export function FeaturedFreelancersSection({
  freelancers,
  live,
}: {
  freelancers: FeaturedFreelancer[]
  live: boolean
}) {
  return (
    <section className="border-b border-border bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Featured talent</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
              Hire proven freelancers on TaskPay
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground md:text-lg">
              Profiles pulled from Supabase — sorted by rating and review volume so visitors see your best people
              first.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-full">
            <Link href="/signup">Post a job</Link>
          </Button>
        </div>

        {freelancers.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            {live
              ? "No freelancer profiles matched the filter yet. Add seed data or relax RLS / filters."
              : "Connect Supabase to load featured freelancers."}
          </p>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {freelancers.map((person) => {
              const rate =
                person.hourly_rate != null
                  ? `$${person.hourly_rate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/hr`
                  : "Rate on request"
              const reviews = person.review_count ?? 0
              const rating = person.rating ?? 0
              const skills = (person.skills ?? []).slice(0, 3)

              return (
                <li key={person.id}>
                  <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col gap-4 p-5">
                      <div className="flex items-start gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                          {person.avatar_url ? (
                            <Image
                              src={person.avatar_url}
                              alt={person.full_name ? `${person.full_name} profile photo` : "Freelancer profile photo"}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
                              {initials(person.full_name)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold leading-tight">
                            {person.full_name ?? "Freelancer"}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                            {person.title ?? "Independent professional"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <StarRow rating={rating} />
                        <span className="text-muted-foreground">
                          {rating > 0 ? rating.toFixed(1) : "New"}
                          {reviews > 0 ? ` (${reviews})` : ""}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-foreground">{rate}</p>

                      {person.location ? (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" />
                          <span className="truncate">{person.location}</span>
                        </div>
                      ) : null}

                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((s) => (
                            <span
                              key={s}
                              className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <Button asChild variant="secondary" className="mt-auto w-full rounded-full">
                        <Link href="/signup">Invite to job</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
