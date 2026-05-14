"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, DollarSign, Briefcase, MessageSquare, Users, CheckCircle, ChevronRight, Clock } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { AppNav } from "@/components/app/app-nav"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { cn } from "@/lib/utils"

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

function formatBudget(job: Job) {
  if (job.budget_min || job.budget_max) {
    const min = job.budget_min ? `$${job.budget_min.toLocaleString()}` : ""
    const max = job.budget_max ? `$${job.budget_max.toLocaleString()}` : ""
    return min && max ? `${min} – ${max}` : min || max
  }
  return "Not specified"
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  return `${days} days ago`
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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

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

  const totalProposals = jobs.reduce((sum, j) => sum + ((j as any).proposals?.[0]?.count ?? j.proposals_count ?? 0), 0)
  const openJobs = jobs.filter(j => j.status === "open").length

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <Toaster position="top-right" richColors />
      <AppNav />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {name ? `Welcome back, ${name.split(" ")[0]}` : "Dashboard"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your jobs and hired talent</p>
          </div>
          <Button asChild className="rounded-full bg-[#14a800] hover:bg-[#14a800]/90 text-white gap-2">
            <Link href="/post-job"><Plus className="size-4" />Post a Job</Link>
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Open Jobs", value: openJobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Contracts", value: contracts.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Proposals", value: totalProposals, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Total Spent", value: "$0", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
              <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Contracts */}
        {contracts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Active Contracts</h2>
            <div className="space-y-3">
              {contracts.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700 shrink-0">
                      {c.freelancer_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{c.freelancer_name}</p>
                      <p className="text-xs text-gray-500">{c.job_title}</p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full shrink-0">
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
          <h2 className="text-base font-semibold text-gray-900 mb-3">My Jobs</h2>
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <Briefcase className="mx-auto size-12 text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">No jobs posted yet</h2>
              <p className="mt-2 text-gray-400 text-sm">Post your first job to find talented freelancers.</p>
              <Button asChild className="mt-6 rounded-full bg-[#14a800] hover:bg-[#14a800]/90 text-white">
                <Link href="/post-job"><Plus className="mr-2 size-4" />Post your first job</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const proposalCount = (job as any).proposals?.[0]?.count ?? job.proposals_count ?? 0
                const isInProgress = job.status === "in_progress"
                const isClosed = job.status === "closed"
                return (
                  <div key={job.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Job header */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium",
                              job.status === "open" ? "bg-green-100 text-green-700" :
                              job.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                              job.status === "closed" ? "bg-gray-100 text-gray-600" :
                              "bg-yellow-100 text-yellow-700"
                            )}>
                              {job.status === "in_progress" ? "In Progress" : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="size-3" />Posted {timeAgo(job.created_at)}</span>
                            <span className="flex items-center gap-1"><DollarSign className="size-3" />{formatBudget(job)}</span>
                            <span className="capitalize">{job.job_type}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-gray-900">{proposalCount}</p>
                          <p className="text-xs text-gray-400">proposals</p>
                        </div>
                      </div>
                    </div>

                    {/* Pipeline steps */}
                    {!isClosed && (
                      <div className="border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
                        {[
                          { label: "View Job Post", href: `/jobs/${job.id}`, active: true },
                          { label: `Review Proposals (${proposalCount})`, href: `/dashboard/client/jobs/${job.id}/proposals`, active: proposalCount > 0 },
                          { label: isInProgress ? "✓ Hired" : "Hire", href: `/dashboard/client/jobs/${job.id}/proposals`, active: isInProgress },
                        ].map((step, i) => (
                          <Link
                            key={i}
                            href={step.href}
                            className={cn(
                              "flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors",
                              step.active
                                ? "text-[#14a800] hover:bg-green-50"
                                : "text-gray-300 cursor-default pointer-events-none"
                            )}
                          >
                            {step.label}
                            {step.active && <ChevronRight className="size-3" />}
                          </Link>
                        ))}
                      </div>
                    )}

                    {isClosed && (
                      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1.5"><CheckCircle className="size-3.5 text-green-500" />Job completed</span>
                        <Link href={`/dashboard/client/jobs/${job.id}/proposals`} className="text-xs text-[#14a800] hover:underline">View details →</Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
