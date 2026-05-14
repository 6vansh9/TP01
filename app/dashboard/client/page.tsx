"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Calendar, DollarSign, Briefcase, MessageSquare, Users, CheckCircle } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { AppNav } from "@/components/app/app-nav"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

type Job = {
  id: string
  title: string
  status: "draft" | "open" | "closed" | "in_progress"
  proposals_count: number
  proposals?: { count: number }[]
  budget_min: number | null
  budget_max: number | null
  job_type: "hourly" | "fixed"
  created_at: string
}

type Contract = {
  id: string
  job_title: string
  job_id: string
  freelancer_name: string
  conversation_id: string
}

export default function ClientDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr || !user) { toast.error("You need to be signed in."); return }

        const { data: profile } = await supabase
          .from("profiles").select("full_name").eq("id", user.id).single()
        setName(profile?.full_name ?? "")

        const { data, error } = await supabase
          .from("jobs")
          .select("*, proposals(count)")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })
        if (error) { toast.error(error.message); return }
        setJobs(data || [])

        // Fetch active contracts
        const { data: convs } = await supabase
          .from("conversations")
          .select("id, job_id, freelancer_id")
          .eq("client_id", user.id)

        if (convs?.length) {
          const jobIds = convs.map(c => c.job_id)
          const freelancerIds = convs.map(c => c.freelancer_id)
          const { data: jobRows } = await supabase.from("jobs").select("id, title").in("id", jobIds)
          const { data: freelancers } = await supabase.from("profiles").select("id, full_name").in("id", freelancerIds)
          const jobMap = Object.fromEntries((jobRows ?? []).map(j => [j.id, j.title]))
          const flMap = Object.fromEntries((freelancers ?? []).map(f => [f.id, f.full_name]))
          setContracts(convs.map(c => ({
            id: c.id,
            job_id: c.job_id,
            job_title: jobMap[c.job_id] ?? "Job",
            freelancer_name: flMap[c.freelancer_id] ?? "Freelancer",
            conversation_id: c.id,
          })))
        }
      } catch (err) {
        toast.error("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      open: "bg-green-100 text-green-700",
      closed: "bg-red-100 text-red-700",
      in_progress: "bg-blue-100 text-blue-700",
    }
    const labels: Record<string, string> = {
      draft: "Draft", open: "Open", closed: "Closed", in_progress: "In Progress"
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.open}`}>
        {labels[status] || status}
      </span>
    )
  }

  function formatBudget(job: Job) {
    if (job.budget_min || job.budget_max) {
      const min = job.budget_min ? `$${job.budget_min.toLocaleString()}` : "$0"
      const max = job.budget_max ? `$${job.budget_max.toLocaleString()}` : ""
      return max ? `${min} – ${max}` : min
    }
    return "Not specified"
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const totalProposals = jobs.reduce((sum, j) => sum + ((j as any).proposals?.[0]?.count ?? j.proposals_count ?? 0), 0)

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <AppNav />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              {name ? `Welcome back, ${name.split(" ")[0]} 👋` : "Client Dashboard"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your jobs and contracts</p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/post-job"><Plus className="mr-2 size-4" />Post a Job</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Jobs Posted", value: jobs.length, icon: Briefcase, color: "text-blue-500" },
            { label: "Active Contracts", value: contracts.length, icon: CheckCircle, color: "text-green-500" },
            { label: "Total Proposals", value: totalProposals, icon: Users, color: "text-purple-500" },
            { label: "Total Spent", value: "$0", icon: DollarSign, color: "text-emerald-500" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border p-4">
              <stat.icon className={`size-5 mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active Contracts */}
        {contracts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Active Contracts</h2>
            <div className="space-y-3">
              {contracts.map(c => (
                <div key={c.id} className="rounded-xl border border-border p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{c.job_title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Freelancer: {c.freelancer_name}</p>
                  </div>
                  <Button asChild size="sm" className="gap-1.5 shrink-0">
                    <Link href="/messages">
                      <MessageSquare className="size-3.5" /> Message
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Posted Jobs</h2>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <Briefcase className="mx-auto size-12 text-muted-foreground/40 mb-4" />
              <h2 className="text-lg font-semibold">No jobs posted yet</h2>
              <p className="mt-2 text-muted-foreground text-sm">Post your first job to find talented freelancers.</p>
              <Button asChild className="mt-6 rounded-full">
                <Link href="/post-job"><Plus className="mr-2 size-4" />Post your first job</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-4" />Posted {formatDate(job.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="size-4" />{formatBudget(job)}
                        </span>
                        <span className="capitalize">{job.job_type}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-muted-foreground">Proposals</p>
                      <p className="text-2xl font-bold">{(job as any).proposals?.[0]?.count ?? job.proposals_count}</p>
                      <Link href={`/dashboard/client/jobs/${job.id}/proposals`} className="text-xs text-primary hover:underline">
                        View Proposals →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
