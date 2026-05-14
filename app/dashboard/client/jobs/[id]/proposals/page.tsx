"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from "lucide-react"

type Proposal = {
  id: string
  cover_letter: string
  bid_amount: number | null
  status: string
  created_at: string
  freelancer_id: string
  freelancer_name: string
  freelancer_title: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function JobProposalsPage() {
  const { id } = useParams()
  const jobId = Array.isArray(id) ? id[0] : id
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [jobTitle, setJobTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Fetch job title
      const { data: job } = await supabase
        .from("jobs").select("title").eq("id", jobId).single()
      setJobTitle(job?.title ?? "")

      // Fetch proposals without join
      const { data: props, error } = await supabase
        .from("proposals")
        .select("id, cover_letter, bid_amount, status, created_at, freelancer_id")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false })

      if (error) { console.error(error); setLoading(false); return }
      if (!props?.length) { setLoading(false); return }

      // Fetch freelancer profiles separately
      const freelancerIds = props.map(p => p.freelancer_id)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, title")
        .in("id", freelancerIds)

      console.log("profiles fetched:", profiles, "ids:", freelancerIds)
      const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))

      setProposals(props.map(p => ({
        ...p,
        freelancer_name: profileMap[p.freelancer_id]?.full_name ?? "Freelancer",
        freelancer_title: profileMap[p.freelancer_id]?.title ?? "",
        
      })))
      setLoading(false)
    }
    fetchData()
  }, [jobId])

  async function updateStatus(proposal: Proposal, status: "accepted" | "rejected") {
    setUpdating(proposal.id)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.from("proposals").update({ status }).eq("id", proposal.id)
    if (error) { showToast("Error: " + error.message); setUpdating(null); return }

    await supabase.from("notifications").insert({
      user_id: proposal.freelancer_id,
      title: status === "accepted" ? "🎉 You've been hired!" : "Application Update",
      message: status === "accepted"
        ? `Congratulations! The client accepted your proposal for "${jobTitle}".`
        : `Thank you for applying to "${jobTitle}". The client moved forward with another freelancer.`,
      type: status,
      link: status === "accepted" ? "/dashboard/freelancer" : "/find-work",
    })

    if (status === "accepted") {
      await supabase.from("jobs").update({ status: "in_progress" }).eq("id", jobId)
      // Auto-create conversation
      const { data: jobRow } = await supabase.from("jobs").select("client_id").eq("id", jobId).single()
      if (jobRow) {
        const { error: convErr } = await supabase.from("conversations").upsert({
          job_id: jobId,
          client_id: jobRow.client_id,
          freelancer_id: proposal.freelancer_id,
        }, { onConflict: "job_id,freelancer_id" })
        console.log("conv upsert error:", convErr)
      }
    }

    setProposals(prev => prev.map(p => p.id === proposal.id ? { ...p, status } : p))
    showToast(status === "accepted" ? "Freelancer hired! Notification sent." : "Proposal declined.")
    setUpdating(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-foreground text-background px-4 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back
        </button>
        <h1 className="text-2xl font-bold mb-1">Proposals</h1>
        <p className="text-muted-foreground text-sm mb-6">{jobTitle}</p>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : proposals.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No proposals yet.</div>
        ) : (
          <div className="space-y-4">
            {proposals.map(p => (
              <div key={p.id} className="rounded-xl border border-border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {p.freelancer_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold flex items-center gap-2 flex-wrap">
                    {p.freelancer_name}
                    {p.edu_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">🎓 Student Verified</span>
                    )}
                  </p>
                        
                        <a
                          href={`/profile/${p.freelancer_id}`}
                          target="_blank"
                          className="text-xs text-primary hover:underline flex items-center gap-0.5"
                        >
                          View Profile <ExternalLink className="size-3" />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.freelancer_title}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {p.bid_amount && <p className="font-semibold text-sm">${p.bid_amount.toLocaleString()}</p>}
                    <p className="text-xs text-muted-foreground">{timeAgo(p.created_at)}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{p.cover_letter}</p>

                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    p.status === "accepted" ? "bg-green-100 text-green-700" :
                    p.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {p.status === "accepted" ? "✓ Hired" : p.status === "rejected" ? "✗ Declined" : "Pending"}
                  </span>
                  {p.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(p, "accepted")} disabled={updating === p.id} className="gap-1.5">
                        <CheckCircle className="size-3.5" />{updating === p.id ? "..." : "Hire"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(p, "rejected")} disabled={updating === p.id} className="gap-1.5 border-destructive text-destructive hover:bg-destructive/10">
                        <XCircle className="size-3.5" />{updating === p.id ? "..." : "Decline"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
