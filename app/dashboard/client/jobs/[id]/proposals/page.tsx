"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AppNav } from "@/components/app/app-nav"
import { Button } from "@/components/ui/button"

type Proposal = {
  id: string
  job_id: string
  freelancer_id: string
  cover_letter: string | null
  bid_amount: number | null
  status: string
  created_at: string
  profile?: {
    full_name: string | null
    avatar_url: string | null
    title: string | null
    bio: string | null
    location: string | null
    hourly_rate: number | null
    jobs_completed: number | null
    avg_rating: number | null
    skills: string[] | null
    edu_verified: boolean | null
    phone_verified: boolean | null
  }
}

type Job = {
  id: string
  title: string
  budget: number | null
}

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-yellow-50 text-yellow-700 border border-yellow-200",
  hired:    "bg-green-50  text-green-700  border border-green-200",
  declined: "bg-red-50    text-red-700    border border-red-200",
}

function Avatar({ url, name, size = 48 }: { url?: string | null; name?: string | null; size?: number }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  return url ? (
    <img
      src={url}
      alt={name ?? "avatar"}
      width={size}
      height={size}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center bg-[#14a800] text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}

function Stars({ rating }: { rating: number | null }) {
  const r = rating ?? 0
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i <= Math.round(r) ? "#14a800" : "#d1d5db"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-500">{r > 0 ? r.toFixed(1) : "New"}</span>
    </span>
  )
}

export default function ProposalsPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [job, setJob] = useState<Job | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selected, setSelected] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [jobId])

  async function fetchData() {
    setLoading(true)

    const { data: jobData } = await supabase
      .from("jobs")
      .select("id, title, budget")
      .eq("id", jobId)
      .single()
    setJob(jobData)

    const { data: proposalData } = await supabase
      .from("proposals")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })

    if (proposalData && proposalData.length > 0) {
      const freelancerIds = proposalData.map((p) => p.freelancer_id)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, title, bio, location, hourly_rate, jobs_completed, avg_rating, skills, edu_verified, phone_verified")
        .in("id", freelancerIds)

      const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
      const enriched: Proposal[] = proposalData.map((p) => ({
        ...p,
        profile: profileMap[p.freelancer_id] ?? null,
      }))

      setProposals(enriched)
      setSelected(enriched[0])
    }

    setLoading(false)
  }

  async function updateStatus(proposalId: string, status: "hired" | "declined") {
    setActionLoading(true)
    await supabase.from("proposals").update({ status }).eq("id", proposalId)
    const updated = proposals.map((p) =>
      p.id === proposalId ? { ...p, status } : p
    )
    setProposals(updated)
    if (selected?.id === proposalId) setSelected((s) => s ? { ...s, status } : s)
    setActionLoading(false)
  }

  const counts = {
    total:    proposals.length,
    pending:  proposals.filter((p) => p.status === "pending").length,
    hired:    proposals.filter((p) => p.status === "hired").length,
    declined: proposals.filter((p) => p.status === "declined").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-[#14a800] border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to jobs
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{job?.title ?? "Job Proposals"}</h1>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mt-3 text-sm">
            {[
              { label: "Total",    val: counts.total,    color: "text-gray-700" },
              { label: "Pending",  val: counts.pending,  color: "text-yellow-600" },
              { label: "Hired",    val: counts.hired,    color: "text-green-600" },
              { label: "Declined", val: counts.declined, color: "text-red-500" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`font-semibold text-base ${color}`}>{val}</span>
                <span className="text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-gray-400 text-lg">No proposals yet.</p>
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            {/* Left — proposal list */}
            <div className="w-[340px] flex-shrink-0 flex flex-col gap-3">
              {proposals.map((p) => {
                const isSelected = selected?.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-[#14a800] bg-white shadow-md shadow-[#14a800]/10"
                        : "border-gray-100 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar url={p.profile?.avatar_url} name={p.profile?.full_name} size={44} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 truncate text-sm">
                            {p.profile?.full_name ?? "Anonymous"}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[p.status] ?? STATUS_STYLES.pending}`}>
                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{p.profile?.title ?? "Freelancer"}</p>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {p.profile?.edu_verified && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-full font-medium">🎓 Student Verified</span>
                          )}
                          {p.profile?.phone_verified && (
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full font-medium">✅ Phone Verified</span>
                          )}
                        </div>

                        {/* Bid + preview */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#14a800] font-semibold text-sm">
                            ${p.bid_amount?.toLocaleString() ?? "—"}
                          </span>
                          <Stars rating={p.profile?.avg_rating ?? null} />
                        </div>
                        {p.cover_letter && (
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {p.cover_letter}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right — detail panel */}
            {selected && (
              <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Top section */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <Avatar url={selected.profile?.avatar_url} name={selected.profile?.full_name} size={72} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{selected.profile?.full_name ?? "Anonymous"}</h2>
                          <p className="text-gray-500 text-sm mt-0.5">{selected.profile?.title ?? "Freelancer"}</p>
                          {selected.profile?.location && (
                            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="9" r="2.5" />
                              </svg>
                              {selected.profile.location}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_STYLES[selected.status] ?? STATUS_STYLES.pending}`}>
                            {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                          </span>
                          {/* ✅ View Profile button */}
                          <a
                            href={`/profile/${selected.freelancer_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[#14a800] hover:text-[#118200] font-medium transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            View Public Profile
                          </a>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {selected.profile?.edu_verified && (
                          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full font-medium">🎓 Student Verified</span>
                        )}
                        {selected.profile?.phone_verified && (
                          <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full font-medium">✅ Phone Verified</span>
                        )}
                      </div>

                      <div className="mt-2">
                        <Stars rating={selected.profile?.avg_rating ?? null} />
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mt-5 bg-gray-50 rounded-xl p-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">${selected.bid_amount?.toLocaleString() ?? "—"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Bid amount</p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <p className="text-lg font-bold text-gray-900">
                        {selected.profile?.hourly_rate ? `$${selected.profile.hourly_rate}/hr` : "—"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Hourly rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{selected.profile?.jobs_completed ?? 0}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Jobs completed</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
                  {selected.cover_letter && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Cover Letter</h3>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selected.cover_letter}</p>
                    </div>
                  )}

                  {selected.profile?.bio && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">About</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{selected.profile.bio}</p>
                    </div>
                  )}

                  {selected.profile?.skills && selected.profile.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selected.profile.skills.map((skill) => (
                          <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Applied</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selected.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                {selected.status === "pending" && (
                  <div className="p-5 border-t border-gray-100 flex gap-3">
                    <Button
                      className="flex-1 bg-[#14a800] hover:bg-[#118200] text-white rounded-xl h-11 font-semibold"
                      onClick={() => updateStatus(selected.id, "hired")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Saving…" : "Hire Freelancer"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-11 font-semibold"
                      onClick={() => updateStatus(selected.id, "declined")}
                      disabled={actionLoading}
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {selected.status !== "pending" && (
                  <div className="p-5 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-400">
                      This proposal has been <span className="font-medium">{selected.status}</span>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
