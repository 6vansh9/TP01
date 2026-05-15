"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Apple } from "lucide-react"
import { toast, Toaster } from "sonner"
import { UpworkLogo } from "@/components/upwork-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5c-7.5 0-14 4.3-17.7 10.2z"/>
    <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.9 39.2 16.4 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2c-.4.4 6.7-4.9 6.7-14.9 0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
)

export default function FreelancerSignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleGoogleSignup() {
    try {
      setGoogleLoading(true)
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error("Google signup error: " + error.message)
      }
    } catch (err) {
      toast.error("Unexpected error: " + err)
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    if (!fullName) {
      setErrorMsg("Please enter your first and last name.")
      return
    }

    setSubmitting(true)
    try {
      // Block re-signup if email already has an account
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const { exists } = await checkRes.json()
      if (exists) {
        setErrorMsg("An account with this email already exists. Please log in, or delete your existing account to start fresh.")
        setSubmitting(false)
        return
      }

      let supabase
      try {
        supabase = createSupabaseBrowserClient()
      } catch {
        setErrorMsg("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
        return
      }

      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: origin ? `${origin}/onboarding` : undefined,
          data: {
            full_name: fullName,
            signup_as: "freelancer",
          },
        },
      })

      if (error) {
        setErrorMsg(error.message)
        toast.error(error.message)
        return
      }

      const user = data.user
      const session = data.session

      if (user) {
        const { error: profileErr } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name: fullName,
            role: "freelancer",
            onboarding_completed: false,
          },
          { onConflict: "id" },
        )
        if (profileErr) {
          console.error(profileErr)
          toast.error(profileErr.message || "Account created but profile could not be saved.")
        }
      }

      if (!session) {
        toast.info("Check your email to confirm your account, then sign in to continue onboarding.")
        router.push("/login?next=/onboarding&registered=1")
        return
      }

      toast.success("Welcome! Let's set up your profile.")
      router.refresh()
      router.push("/onboarding")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong."
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
          <UpworkLogo />
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-foreground/80 md:inline">Here to hire talent?</span>
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Join as a Client
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-4 py-12 md:py-16">
        <h1 className="text-balance text-center font-display text-3xl font-medium tracking-tight md:text-4xl">
          Sign up to find work you love
        </h1>

        {errorMsg ? (
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Could not create account</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-foreground bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            <Apple className="size-5 fill-current" />
            Continue with Apple
          </button>
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-4 text-sm font-medium text-white hover:bg-[#1765c8] disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>

        <div className="relative my-8 flex items-center">
          <div className="flex-1 border-t border-border" />
          <span className="mx-4 text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" required className="h-12 rounded-md" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name"/>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" required className="h-12 rounded-md" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name"/>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required className="h-12 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"/>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} required minLength={8} placeholder="Password (8 or more characters)" className="h-12 rounded-md pr-12" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"/>
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="country">Country</Label>
            <Select defaultValue="india">
              <SelectTrigger id="country" className="h-12 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="pk">Pakistan</SelectItem>
                <SelectItem value="ph">Philippines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox defaultChecked className="mt-0.5" />
              <span>Send me helpful emails to find rewarding work and job leads.</span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox required className="mt-0.5" />
              <span>
                Yes, I understand and agree to the{" "}
                <Link href="#" className="font-semibold text-primary hover:underline">TaskPay Terms of Service</Link>
                , including the{" "}
                <Link href="#" className="font-semibold text-primary hover:underline">User Agreement</Link>
                {" "}and{" "}
                <Link href="#" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <Button type="submit" disabled={submitting} className="mt-4 h-12 w-full rounded-full bg-primary text-base font-medium">
            {submitting ? "Creating account..." : "Create my account"}
          </Button>
        </form>
      </main>
    </div>
  )
}
