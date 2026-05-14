"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Pencil, MapPin, Share2, BadgeCheck, Plus, X, Star, Upload } from "lucide-react"
import { AppNav } from "@/components/app/app-nav"
import { createBrowserClient } from "@supabase/ssr"

interface Profile {
  id: string
  full_name: string | null
  edu_verified: boolean | null
  phone_verified: boolean | null
  avatar_url: string | null
  title: string | null
  bio: string | null
  hourly_rate: number | null
  location: string | null
  skills: string[] | null
  role: string | null
  onboarding_completed: boolean | null
  rating: number | null
  review_count: number | null
  jobs_completed: number | null
}

function Modal({ title, onClose, onSave, saving, children }: {
  title: string; onClose: () => void; onSave: () => void; saving?: boolean; children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100"><X className="size-5 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-full bg-[#14a800] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#14a800]/90">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button aria-label={label} onClick={onClick} className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#14a800]/40 text-[#14a800] hover:bg-[#14a800]/5 transition-colors">
      <Pencil className="size-3.5" />
    </button>
  )
}

const SUGGESTED_SKILLS = [
  "JavaScript","TypeScript","React.js","Next.js","Node.js","Python","Tailwind CSS",
  "PostgreSQL","REST APIs","GraphQL","Vue.js","Angular","Django","FastAPI","Docker",
  "AWS","UI/UX Design","Figma","Mobile Development","React Native","Machine Learning",
  "Data Analysis","PHP","Laravel","WordPress",
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [editingName, setEditingName] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [editingRate, setEditingRate] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [draftTitle, setDraftTitle] = useState("")
  const [draftBio, setDraftBio] = useState("")
  const [draftRate, setDraftRate] = useState("")
  const [draftLocation, setDraftLocation] = useState("")
  const [draftSkills, setDraftSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function saveField(fields: Partial<Profile>) {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from("profiles").update(fields).eq("id", profile.id)
    if (!error) { setProfile(prev => prev ? { ...prev, ...fields } : prev); showToast("Saved!") }
    else showToast("Error saving")
    setSaving(false)
  }

  async function savePhoto() {
    if (!profile || !avatarFile) return
    setSaving(true)
    const ext = avatarFile.type === "image/png" ? "png" : "jpg"
    const path = `${profile.id}/avatar.${ext}`
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true })
    if (uploadErr) { showToast("Upload failed"); setSaving(false); return }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path)
    await saveField({ avatar_url: pub.publicUrl })
    setEditingPhoto(false)
    setSaving(false)
  }

  function openEdit(type: string) {
    if (!profile) return
    if (type === "name") { setDraftName(profile.full_name ?? ""); setEditingName(true) }
    if (type === "title") { setDraftTitle(profile.title ?? ""); setEditingTitle(true) }
    if (type === "bio") { setDraftBio(profile.bio ?? ""); setEditingBio(true) }
    if (type === "rate") { setDraftRate(String(profile.hourly_rate ?? "")); setEditingRate(true) }
    if (type === "location") { setDraftLocation(profile.location ?? ""); setEditingLocation(true) }
    if (type === "skills") { setDraftSkills(profile.skills ?? []); setEditingSkills(true) }
    if (type === "photo") { setAvatarFile(null); setAvatarPreview(null); setEditingPhoto(true) }
  }

  const displayName = profile?.full_name ?? "Your Name"
  const firstName = displayName.split(" ")[0]
  const lastInitial = displayName.split(" ")[1]?.[0] ?? ""
  const shortName = lastInitial ? `${firstName} ${lastInitial}.` : firstName

  if (loading) return <div className="min-h-screen bg-[#f7f7f5]"><AppNav /><div className="py-20 text-center text-gray-400">Loading...</div></div>

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <AppNav />
      {toast && <div className="fixed top-4 right-4 z-50 rounded-xl bg-gray-900 text-white px-4 py-3 text-sm shadow-lg">{toast}</div>}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="size-24 rounded-full overflow-hidden bg-[#14a800]/10 flex items-center justify-center">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                  : <span className="text-3xl font-bold text-[#14a800]">{displayName[0]?.toUpperCase()}</span>}
              </div>
              <button onClick={() => openEdit("photo")} className="absolute bottom-0 right-0 size-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                <Pencil className="size-3 text-gray-600" />
              </button>
              <div className="absolute top-1 right-1 size-3.5 rounded-full bg-[#14a800] border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{shortName}</h1>
                <EditBtn onClick={() => openEdit("name")} label="Edit name" />
                {profile?.edu_verified && <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">🎓 Student Verified</span>}
                {profile?.phone_verified && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700"><BadgeCheck className="size-3.5" /> Phone Verified</span>}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="size-3.5" />
                <span>{profile?.location ?? "Add your location"}</span>
                <EditBtn onClick={() => openEdit("location")} label="Edit location" />
              </div>
              {profile?.rating && (
                <div className="mt-2 flex items-center gap-1.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`size-4 ${s <= Math.round(profile.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                  <span className="text-sm font-semibold text-gray-700">{profile.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({profile.review_count ?? 0} reviews)</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link href={profile?.id ? `/profile/${profile.id}` : "#"} target="_blank" className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 text-center">See public view</Link>
              <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 flex items-center gap-2 justify-center"><Share2 className="size-4" /> Share</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-500">Hourly rate</p>
                <EditBtn onClick={() => openEdit("rate")} label="Edit rate" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{profile?.hourly_rate ? `$${profile.hourly_rate.toLocaleString()}.00/hr` : "—"}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <h3 className="font-semibold text-gray-900">Stats</h3>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Jobs completed</span><span className="font-semibold">{profile?.jobs_completed ?? 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Reviews</span><span className="font-semibold">{profile?.review_count ?? 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Rating</span><span className="font-semibold">{profile?.rating ? `${profile.rating}/5` : "—"}</span></div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Verifications</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {profile?.phone_verified ? <BadgeCheck className="size-4 text-green-500" /> : <div className="size-4 rounded-full border-2 border-gray-300" />}
                  <span className={profile?.phone_verified ? "text-green-700 font-medium" : "text-gray-500"}>Phone {profile?.phone_verified ? "verified" : "not verified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {profile?.edu_verified ? <BadgeCheck className="size-4 text-blue-500" /> : <div className="size-4 rounded-full border-2 border-gray-300" />}
                  <span className={profile?.edu_verified ? "text-blue-700 font-medium" : "text-gray-500"}>Student {profile?.edu_verified ? "verified" : "not verified"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900">{profile?.title ?? "Add your professional title"}</h2>
                <EditBtn onClick={() => openEdit("title")} label="Edit title" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Overview</h3>
                <EditBtn onClick={() => openEdit("bio")} label="Edit bio" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{profile?.bio ?? "Add a professional overview to tell clients about yourself."}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Skills</h3>
                <EditBtn onClick={() => openEdit("skills")} label="Edit skills" />
              </div>
              {profile?.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(s => <span key={s} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">{s}</span>)}
                </div>
              ) : <p className="text-sm text-gray-400">Add skills to show clients what you can do.</p>}
            </div>
          </div>
        </div>
      </main>

      {editingName && <Modal title="Edit name" onClose={() => setEditingName(false)} onSave={async () => { await saveField({ full_name: draftName }); setEditingName(false) }} saving={saving}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
        <input value={draftName} onChange={e => setDraftName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#14a800]" placeholder="Your full name" />
      </Modal>}

      {editingTitle && <Modal title="Edit professional title" onClose={() => setEditingTitle(false)} onSave={async () => { await saveField({ title: draftTitle }); setEditingTitle(false) }} saving={saving}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
        <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#14a800]" placeholder="e.g. Full Stack Developer" />
      </Modal>}

      {editingBio && <Modal title="Edit overview" onClose={() => setEditingBio(false)} onSave={async () => { await saveField({ bio: draftBio }); setEditingBio(false) }} saving={saving}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Overview</label>
        <textarea value={draftBio} onChange={e => setDraftBio(e.target.value)} rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#14a800] resize-none" placeholder="Tell clients about yourself..." />
        <p className="mt-1 text-xs text-gray-400">{draftBio.length} characters</p>
      </Modal>}

      {editingRate && <Modal title="Edit hourly rate" onClose={() => setEditingRate(false)} onSave={async () => { await saveField({ hourly_rate: parseFloat(draftRate) }); setEditingRate(false) }} saving={saving}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly rate (USD)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input type="number" value={draftRate} onChange={e => setDraftRate(e.target.value)} className="w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#14a800]" placeholder="0" />
        </div>
      </Modal>}

      {editingLocation && <Modal title="Edit location" onClose={() => setEditingLocation(false)} onSave={async () => { await saveField({ location: draftLocation }); setEditingLocation(false) }} saving={saving}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
        <input value={draftLocation} onChange={e => setDraftLocation(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#14a800]" placeholder="e.g. Mumbai, India" />
      </Modal>}

      {editingSkills && <Modal title="Edit skills" onClose={() => setEditingSkills(false)} onSave={async () => { await saveField({ skills: draftSkills }); setEditingSkills(false) }} saving={saving}>
        <div className="space-y-4">
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && skillInput.trim()) { setDraftSkills(s => [...s, skillInput.trim()]); setSkillInput("") } }} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#14a800]" placeholder="Type a skill and press Enter" />
          {draftSkills.length > 0 && <div className="flex flex-wrap gap-2">{draftSkills.map(s => <span key={s} className="flex items-center gap-1.5 rounded-full bg-[#14a800]/10 px-3 py-1 text-sm font-medium text-[#14a800]">{s}<button onClick={() => setDraftSkills(p => p.filter(x => x !== s))}><X className="size-3" /></button></span>)}</div>}
          <div>
            <p className="text-xs text-gray-500 mb-2">Suggested</p>
            <div className="flex flex-wrap gap-1.5">{SUGGESTED_SKILLS.filter(s => !draftSkills.includes(s)).slice(0,12).map(s => <button key={s} onClick={() => setDraftSkills(p => [...p, s])} className="rounded-full border border-gray-200 px-3 py-1 text-xs hover:border-[#14a800] hover:text-[#14a800] transition-colors">+ {s}</button>)}</div>
          </div>
        </div>
      </Modal>}

      {editingPhoto && <Modal title="Update profile photo" onClose={() => setEditingPhoto(false)} onSave={savePhoto} saving={saving}>
        <div onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-8 cursor-pointer hover:border-[#14a800] transition-colors">
          {avatarPreview ? <img src={avatarPreview} alt="" className="size-24 rounded-full object-cover" /> : <Upload className="size-8 text-gray-400" />}
          <p className="text-sm text-gray-500">{avatarPreview ? "Click to change" : "Click to upload photo"}</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)) } }} />
        </div>
      </Modal>}
    </div>
  )
}
