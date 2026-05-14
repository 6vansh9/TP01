"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, BadgeCheck, Star } from "lucide-react"

type Job = {
  id: string
  title: string
  description: string
  skills: string[]
  job_type: string
  budget_min: number | null
  budget_max: number | null
  duration: string | null
  level: string
  proposals_count: number
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single()
      setJob(data)
      setLoading(false)
    }
    fetchJob()
  }, [id])

  async function handleApply() {
    if (!coverLetter.trim()) return
    setApplying(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const { error } = await supabase.from("proposals").insert({
      job_id: id,
      freelancer_id: user.id,
      cover_letter: coverLetter,
      bid_amount: bidAmount ? parseFloat(bidAmount) : null,
      status: "pending"
    })

    if (!error) {
      await supabase.rpc("increment_proposals", { job_id: id })
      setApplied(true)
      setShowApplyForm(false)
    } else {
      alert("Error: " + error.message)
    }
    setApplying(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="flex items-center justify-center py-32 text-muted-foreground">Loading...</div>
    </div>
  )

  if (!job) return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="flex items-center justify-center py-32 text-muted-foreground">Job not found.</div>
    </div>
  )

  const budgetDisplay = job.job_type === "fixed"
    ? `$${job.budget_min ?? 0} - $${job.budget_max ?? 0}`
    : `$${job.budget_min ?? 0} - $${job.budget_max ?? 0}/hr`

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to jobs
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-border p-6">
              <p className="text-xs text-muted-foreground">
                Posted {timeAgo(job.created_at)} · Proposals: {job.proposals_count === 0 ? "No proposals yet" : job.proposals_count}
              </p>
              <h1 className="mt-2 text-2xl font-bold">{job.title}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{job.job_type === "fixed" ? "Fixed-price" : "Hourly"}</span>
                <span>·</span>
                <span className="capitalize">{job.level} level</span>
                {job.duration && <><span>·</span><span>{job.duration}</span></>}
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <h2 className="font-semibold mb-2">Job Description</h2>
                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{job.description}</p>
              </div>
              {job.skills?.length > 0 && (
                <div className="mt-6 border-t border-border pt-6">
                  <h2 className="font-semibold mb-3">Skills and Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span key={skill} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {showApplyForm && (
              <div className="rounded-xl border border-primary p-6 space-y-4">
                <h2 className="font-semibold text-lg">Submit a Proposal</h2>
                <div>
                  <label className="text-sm font-medium">Cover Letter *</label>
                  <textarea
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={5}
                    placeholder="Introduce yourself and explain why you're a great fit..."
                    className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Your Bid ({job.job_type === "fixed" ? "fixed price $" : "hourly rate $/hr"})
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={job.job_type === "fixed" ? "e.g. 500" : "e.g. 25"}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleApply} disabled={applying || !coverLetter.trim()}>
                    {applying ? "Submitting..." : "Submit Proposal"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowApplyForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5 space-y-4">
              {applied ? (
                <div className="text-center py-2">
                  <p className="font-semibold text-primary">✓ Proposal Submitted!</p>
                  <p className="text-xs text-muted-foreground mt-1">The client will review your proposal.</p>
                </div>
              ) : (
                <Button className="w-full" onClick={() => setShowApplyForm(v => !v)}>
                  {showApplyForm ? "Cancel Application" : "Apply Now"}
                </Button>
              )}
              <div className="border-t border-border pt-4 space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Budget</p>
                  <p className="font-semibold">{budgetDisplay}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Job Type</p>
                  <p className="font-semibold">{job.job_type === "fixed" ? "Fixed-price" : "Hourly"}</p>
                </div>
                {job.duration && (
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{job.duration}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Experience Level</p>
                  <p className="font-semibold capitalize">{job.level}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-3">About the Client</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-primary" />
                  <span>Payment verified</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({length:5}).map((_,i) => (
                    <Star key={i} className="size-3.5 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="ml-1 text-muted-foreground">5.0</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
