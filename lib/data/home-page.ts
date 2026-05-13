import { JOB_STATUS } from "@/lib/constants/job-status"
import { createSupabaseServerClient } from "@/lib/supabase/server"

/** Matches TaskPay `profiles` rows used on the marketing homepage. */
export type FeaturedFreelancer = {
  id: string
  full_name: string | null
  avatar_url: string | null
  title: string | null
  hourly_rate: number | null
  rating: number | null
  review_count: number | null
  skills: string[] | null
  location: string | null
}

export type HomeMarketStats = {
  totalJobs: number
  openJobs: number
  freelancerCount: number
  /** Average `rating` across freelancer profiles that have a rating set. */
  avgFreelancerRating: number | null
}

export type HomePageData = {
  stats: HomeMarketStats
  featuredFreelancers: FeaturedFreelancer[]
  /** When false, UI can show a setup hint (missing env or query errors). */
  live: boolean
}

const FREELANCER_ROLES = ["freelancer", "Freelancer"] as const

function emptyStats(): HomeMarketStats {
  return {
    totalJobs: 0,
    openJobs: 0,
    freelancerCount: 0,
    avgFreelancerRating: null,
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return { stats: emptyStats(), featuredFreelancers: [], live: false }
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return { stats: emptyStats(), featuredFreelancers: [], live: false }
  }

  const [
    totalJobsRes,
    openJobsRes,
    freelancerCountRes,
    ratingsRes,
    featuredRes,
  ] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true }),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", JOB_STATUS.OPEN),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("role", [...FREELANCER_ROLES]),
    supabase
      .from("profiles")
      .select("rating")
      .in("role", [...FREELANCER_ROLES])
      .not("rating", "is", null),
    supabase
      .from("profiles")
      .select(
        "id, full_name, avatar_url, title, hourly_rate, rating, review_count, skills, location, is_available",
      )
      .in("role", [...FREELANCER_ROLES])
      .or("is_available.is.null,is_available.eq.true")
      .order("rating", { ascending: false, nullsFirst: false })
      .order("review_count", { ascending: false, nullsFirst: false })
      .limit(8),
  ])

  const hadError = [totalJobsRes, openJobsRes, freelancerCountRes, ratingsRes, featuredRes].some(
    (r) => r.error,
  )
  if (hadError) {
    return { stats: emptyStats(), featuredFreelancers: [], live: false }
  }

  const ratings = (ratingsRes.data ?? [])
    .map((row) => row.rating)
    .filter((r): r is number => typeof r === "number" && !Number.isNaN(r))
  const avgFreelancerRating =
    ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null

  const stats: HomeMarketStats = {
    totalJobs: totalJobsRes.count ?? 0,
    openJobs: openJobsRes.count ?? 0,
    freelancerCount: freelancerCountRes.count ?? 0,
    avgFreelancerRating,
  }

  const rows = featuredRes.data ?? []
  const featuredFreelancers: FeaturedFreelancer[] = rows.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    title: row.title,
    hourly_rate: row.hourly_rate,
    rating: row.rating,
    review_count: row.review_count,
    skills: row.skills,
    location: row.location,
  }))

  return { stats, featuredFreelancers, live: true }
}
