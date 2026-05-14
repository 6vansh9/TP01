"use client"
import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { AppNav } from "@/components/app/app-nav"
import { JobCard, type Job } from "@/components/app/job-card"
import { FindWorkRail } from "@/components/app/find-work-rail"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@supabase/ssr"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  return `${Math.floor(hrs / 24)} days ago`
}

function toProposalLabel(count: number) {
  if (count === 0) return "No proposals yet"
  if (count < 5) return "Less than 5"
  if (count < 10) return "5 to 10"
  if (count < 20) return "10 to 20"
  return "20+"
}

export default function FindWorkPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("Best Matches")

  useEffect(() => {
    async function fetchJobs() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, description, skills, job_type, budget_min, budget_max, duration, level, proposals_count, created_at")
        .eq("status", "open")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Jobs fetch error:", error.message)
        setLoading(false)
        return
      }

      const mapped: Job[] = (data ?? []).map((j: any) => ({
        id: j.id,
        title: j.title,
        postedAt: timeAgo(j.created_at),
        proposals: toProposalLabel(j.proposals_count ?? 0),
        type: j.job_type === "fixed" ? "Fixed-price" : "Hourly",
        level: j.level
          ? (j.level.charAt(0).toUpperCase() + j.level.slice(1)) as Job["level"]
          : "Intermediate",
        budget: j.job_type === "fixed" && j.budget_max ? `$${j.budget_max}` : undefined,
        hourlyRange: j.job_type === "hourly" && j.budget_min && j.budget_max
          ? `$${j.budget_min}-$${j.budget_max}/hr` : undefined,
        duration: j.duration ?? undefined,
        description: j.description,
        skills: j.skills ?? [],
        paymentVerified: true,
        rating: 5,
        spend: "$0",
        country: "Worldwide",
      }))

      setJobs(mapped)
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const filtered = jobs.filter(j =>
    search === "" ||
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.description.toLowerCase().includes(search.toLowerCase()) ||
    j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const filters = ["Best Matches", "Most Recent", "Saved Jobs"]

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <main>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button variant="outline" className="rounded-full gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
            </div>

            <div className="mt-6 flex gap-6 border-b border-border">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "pb-3 text-sm font-medium transition-colors",
                    activeFilter === f
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mt-2">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading jobs...</div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  {search ? "No jobs match your search." : "No jobs posted yet."}
                </div>
              ) : (
                filtered.map(job => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </main>

          <aside className="hidden lg:block">
            <FindWorkRail />
          </aside>
        </div>
      </div>
    </div>
  )
}
