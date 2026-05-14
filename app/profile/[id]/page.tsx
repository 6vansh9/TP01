"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { AppNav } from "@/components/app/app-nav"
import { MapPin, Star, Briefcase, DollarSign } from "lucide-react"

type Profile = {
  id: string
  full_name: string | null
  title: string | null
  bio: string | null
  hourly_rate: number | null
  skills: string[] | null
  location: string | null
  rating: number | null
  jobs_completed: number | null
  review_count: number | null
  avatar_url: string | null
  experience_level: string | null
}

type Review = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer_name: string
  reviewer_id: string
  job_title: string
  response?: string | null
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "size-5" : "size-3.5"
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${sz} ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function ProfilePage() {
  const { id } = useParams()
  const profileId = Array.isArray(id) ? id[0] : id
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, title, bio, hourly_rate, skills, location, rating, jobs_completed, review_count, avatar_url, experience_level")
        .eq("id", profileId)
        .single()
      setProfile(data)

      // Fetch reviews on this profile
      const { data: revs } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, reviewer_id, job_id")
        .eq("reviewee_id", profileId)
        .order("created_at", { ascending: false })

      if (revs?.length) {
        const reviewerIds = revs.map(r => r.reviewer_id)
        const jobIds = revs.map(r => r.job_id)

        const { data: reviewers } = await supabase
          .from("profiles").select("id, full_name").in("id", reviewerIds)
        const { data: jobRows } = await supabase
          .from("jobs").select("id, title").in("id", jobIds)
        // Fetch responses (reviews left by profileId for same jobs)
        const { data: responses } = await supabase
          .from("reviews")
          .select("job_id, comment")
          .eq("reviewer_id", profileId)
          .in("job_id", jobIds)

        const reviewerMap = Object.fromEntries((reviewers ?? []).map(r => [r.id, r.full_name]))
        const jobMap = Object.fromEntries((jobRows ?? []).map(j => [j.id, j.title]))
        const responseMap = Object.fromEntries((responses ?? []).map(r => [r.job_id, r.comment]))

        setReviews(revs.map(r => ({
          ...r,
          reviewer_name: reviewerMap[r.reviewer_id] ?? "User",
          job_title: jobMap[r.job_id] ?? "Job",
          response: responseMap[r.job_id] ?? null,
        })))
      }

      setLoading(false)
    }
    loadProfile()
  }, [profileId])

  if (loading) return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="py-20 text-center text-muted-foreground">Loading...</div>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="py-20 text-center text-muted-foreground">Profile not found.</div>
    </div>
  )

  const reviewCount = profile.review_count ?? reviews.length

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

        {/* Header */}
        <div className="flex items-start gap-5">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0 overflow-hidden">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="size-20 object-cover" />
              : (profile.full_name?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.full_name ?? "User"}</h1>
            <p className="text-muted-foreground mt-0.5">{profile.title ?? ""}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{profile.location}</span>}
              {profile.hourly_rate && <span className="flex items-center gap-1"><DollarSign className="size-3.5" />${profile.hourly_rate}/hr</span>}
              {profile.jobs_completed != null && <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{profile.jobs_completed} jobs</span>}
            </div>
            {profile.rating ? (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={profile.rating} size="lg" />
                <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-8">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {profile.skills?.length ? (
          <div className="mt-8">
            <h2 className="font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => (
                <span key={s} className="px-3 py-1 rounded-full bg-muted text-sm">{s}</span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Experience */}
        {profile.experience_level && (
          <div className="mt-8">
            <h2 className="font-semibold mb-2">Experience Level</h2>
            <p className="text-sm text-foreground/80 capitalize">{profile.experience_level.replace("_", " ")}</p>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-semibold text-lg">Reviews</h2>
              <span className="text-muted-foreground text-sm">({reviewCount})</span>
              {profile.rating && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <StarRating rating={profile.rating} size="lg" />
                  <span className="font-bold text-lg">{profile.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-border pb-6 last:border-0">
                  {/* Job title + date */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="font-medium text-sm">{r.job_title}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(r.created_at)}</span>
                  </div>

                  {/* Stars + reviewer */}
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={r.rating} />
                    <span className="text-sm font-medium">{r.rating}.0</span>
                  </div>

                  {/* Review text */}
                  {r.comment && (
                    <p className="text-sm text-foreground/80 leading-relaxed mb-3">{r.comment}</p>
                  )}

                  {/* Reviewer */}
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {r.reviewer_name[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-muted-foreground">{r.reviewer_name}</span>
                  </div>

                  {/* Response from profile owner */}
                  {r.response && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Response from {profile.full_name}</p>
                      <p className="text-sm text-foreground/80">{r.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
