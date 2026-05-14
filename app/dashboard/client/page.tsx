"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Calendar, DollarSign, Briefcase } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { AppNav } from "@/components/app/app-nav"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

type Job = {
  id: string
  title: string
  status: "draft" | "open" | "closed"
  proposals_count: number
  budget_min: number | null
  budget_max: number | null
  job_type: "hourly" | "fixed"
  created_at: string
}

export default function ClientDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJobs() {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        
        if (userErr || !user) {
          toast.error("You need to be signed in to view your dashboard.")
          return
        }

        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          toast.error(error.message || "Could not load jobs.")
          return
        }

        setJobs(data || [])
      } catch (err) {
        toast.error("Something went wrong loading your jobs.")
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  function getStatusBadge(status: string) {
    const styles = {
      draft: "bg-gray-100 text-gray-700",
      open: "bg-green-100 text-green-700",
      closed: "bg-red-100 text-red-700",
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status as keyof typeof styles] || styles.open}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  function formatBudget(job: Job) {
    if (job.budget_min || job.budget_max) {
      const min = job.budget_min ? `$${job.budget_min.toLocaleString()}` : "$0"
      const max = job.budget_max ? `$${job.budget_max.toLocaleString()}` : "$0"
      return `${min} - ${max}`
    }
    return "Not specified"
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <AppNav />
      
      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Client Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your posted jobs and track proposals.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/post-job">
              <Plus className="mr-2 size-4" />
              Post a new job
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading your jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
            <Briefcase className="mx-auto size-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold">No jobs posted yet</h2>
            <p className="mt-2 text-muted-foreground">
              Get started by posting your first job to find talented freelancers.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/post-job">
                <Plus className="mr-2 size-4" />
                Post your first job
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-4" />
                        Posted {formatDate(job.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="size-4" />
                        {formatBudget(job)}
                      </span>
                      <span className="capitalize">{job.job_type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Proposals</p>
                      <p className="text-lg font-semibold">{job.proposals_count}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
