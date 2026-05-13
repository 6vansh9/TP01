import type { HomeMarketStats } from "@/lib/data/home-page"

function formatCount(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function formatRating(r: number | null) {
  if (r == null || Number.isNaN(r)) return "—"
  return r.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function HomeMarketStats({
  stats,
  live,
}: {
  stats: HomeMarketStats
  live: boolean
}) {
  const items = [
    { label: "Open jobs", value: formatCount(stats.openJobs) },
    { label: "Freelancers", value: formatCount(stats.freelancerCount) },
    { label: "Total listings", value: formatCount(stats.totalJobs) },
    { label: "Avg. talent rating", value: formatRating(stats.avgFreelancerRating) },
  ]

  return (
    <section className="border-b border-border bg-muted/40 py-10 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">TaskPay marketplace</p>
            <h2 className="mt-1 font-display text-2xl font-medium tracking-tight md:text-3xl">
              Live activity from our community
            </h2>
          </div>
          {!live && (
            <p className="max-w-md text-sm text-muted-foreground">
              Set{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              and ensure <span className="font-medium text-foreground">SELECT</span> on{" "}
              <span className="font-medium text-foreground">jobs</span> (all rows) and{" "}
              <span className="font-medium text-foreground">profiles</span> (freelancer rows + own profile) for the
              anonymous role, and that <span className="font-medium text-foreground">jobs.status</span> uses{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">open</code> for live listings.
            </p>
          )}
        </div>

        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-background px-6 py-5 shadow-sm"
            >
              <dt className="text-sm font-medium text-muted-foreground">{item.label}</dt>
              <dd className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
