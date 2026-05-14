"use client"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { AppNav } from "@/components/app/app-nav"
import Link from "next/link"
import { Briefcase, DollarSign, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Application = {
  id: string
  status: string
  bid_amount: number | null
  created_at: string
  job_title: string
  job_id: string
}

type Contract = {
  id: string
  job_title: string
  job_id: string
  client_name: string
  conversation_id: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function FreelancerDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
      setName(profile?.full_name ?? "Freelancer")

      // Fetch applications
      const { data: props } = await supabase
        .from("proposals")
        .select("id, status, bid_amount, created_at, job_id")
        .eq("freelancer_id", user.id)
        .order("created_at", { ascending: false })

      if (props?.length) {
        const jobIds = props.map(p => p.job_id)
        const { data: jobs } = await supabase
          .from("jobs")
          .select("id, title")
          .in("id", jobIds)
        const jobMap = Object.fromEntries((jobs ?? []).map(j => [j.id, j.title]))
        setApplications(props.map(p => ({
          ...p,
          job_title: jobMap[p.job_id] ?? "Job",
        })))
      }

      // Fetch active contracts (accepted proposals = conversations)
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, job_id, client_id")
        .eq("freelancer_id", user.id)

      if (convs?.length) {
        const jobIds = convs.map(c => c.job_id)
        const clientIds = convs.map(c => c.client_id)

        const { data: jobs } = await supabase
          .from("jobs").select("id, title").in("id", jobIds)
        const { data: clients } = await supabase
          .from("profiles").select("id, full_name").in("id", clientIds)

        const jobMap = Object.fromEntries((jobs ?? []).map(j => [j.id, j.title]))
        const clientMap = Object.fromEntries((clients ?? []).map(c => [c.id, c.full_name]))

        setContracts(convs.map(c => ({
          id: c.id,
          job_id: c.job_id,
          job_title: jobMap[c.job_id] ?? "Job",
          client_name: clientMap[c.client_id] ?? "Client",
          conversation_id: c.id,
        })))
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const earned = applications
    .filter(a => a.status === "accepted" && a.bid_amount)
    .reduce((sum, a) => sum + (a.bid_amount ?? 0), 0)

  if (loading) return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="py-20 text-center text-muted-foreground">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here is your work overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Applications", value: applications.length, icon: Briefcase, color: "text-blue-500" },
            { label: "Active Contracts", value: contracts.length, icon: CheckCircle, color: "text-green-500" },
            { label: "Pending", value: applications.filter(a => a.status === "pending").length, icon: Clock, color: "text-yellow-500" },
            { label: "Earned", value: `$${earned.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border p-4">
              <stat.icon className={`size-5 mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active Contracts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Active Contracts</h2>
          {contracts.length === 0 ? (
            <div className="rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
              No active contracts yet.
              <div className="mt-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/find-work">Browse Jobs</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map(c => (
                <div key={c.id} className="rounded-xl border border-border p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{c.job_title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Client: {c.client_name}</p>
                  </div>
                  <Button asChild size="sm" className="gap-1.5 shrink-0">
                    <Link href="/messages">
                      <MessageSquare className="size-3.5" /> Message
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applications */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <div className="rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
              You have not applied to any jobs yet.
              <div className="mt-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/find-work">Find Work</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(a => (
                <div key={a.id} className="rounded-xl border border-border p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{a.job_title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(a.created_at)}{a.bid_amount ? ` · $${a.bid_amount.toLocaleString()} bid` : ""}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    a.status === "accepted" ? "bg-green-100 text-green-700" :
                    a.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {a.status === "accepted" ? "✓ Hired" : a.status === "rejected" ? "✗ Declined" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
