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
  avatar_url: string | null
  experience_level: string | null
}

export default function ProfilePage() {
  const { id } = useParams()
  const profileId = Array.isArray(id) ? id[0] : id
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, title, bio, hourly_rate, skills, location, rating, jobs_completed, avatar_url, experience_level")
        .eq("id", profileId)
        .single()
      setProfile(data)
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

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex items-start gap-5">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0 overflow-hidden">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="size-20 object-cover" />
              : (profile.full_name?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.full_name ?? "Freelancer"}</h1>
            <p className="text-muted-foreground mt-0.5">{profile.title ?? ""}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{profile.location}</span>}
              {profile.hourly_rate && <span className="flex items-center gap-1"><DollarSign className="size-3.5" />${profile.hourly_rate}/hr</span>}
              {profile.rating && <span className="flex items-center gap-1"><Star className="size-3.5 fill-yellow-400 text-yellow-400" />{profile.rating.toFixed(1)}</span>}
              {profile.jobs_completed != null && <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{profile.jobs_completed} jobs</span>}
            </div>
          </div>
        </div>
        {profile.bio && (
          <div className="mt-8">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
          </div>
        )}
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
        {profile.experience_level && (
          <div className="mt-8">
            <h2 className="font-semibold mb-2">Experience Level</h2>
            <p className="text-sm text-foreground/80 capitalize">{profile.experience_level}</p>
          </div>
        )}
      </div>
    </div>
  )
}
