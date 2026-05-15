"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Apple } from "lucide-react"
import { UpworkLogo } from "@/components/upwork-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5c-7.5 0-14 4.3-17.7 10.2z"/>
    <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.9 39.2 16.4 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2c-.4.4 6.7-4.9 6.7-14.9 0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseBrowserClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError("Invalid email or password.")
      setSubmitting(false)
      return
    }

    const role = data.user?.user_metadata?.role
    if (role === "client") {
      router.push("/dashboard/client")
    } else {
      router.push("/dashboard/freelancer")
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setError("Google login error: " + error.message)
    } catch (err) {
      setError("Unexpected error: " + err)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center px-4 md:px-8">
          <UpworkLogo />
        </div>
      </header>

      <main className="mx-auto flex max-w-[560px] flex-col px-4 py-16 md:py-24">
        <div className="rounded-2xl border border-border bg-background p-8 md:p-12">
          <h1 className="text-center font-display text-3xl font-medium tracking-tight md:text-4xl">
            Log in to TaskPay
          </h1>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-md pl-12 text-base"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-md pl-12 text-base"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="h-14 w-full rounded-md bg-primary text-base font-medium"
            >
              {submitting ? "Logging in..." : "Continue"}
            </Button>
          </form>

          <div className="relative my-8 flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="mx-4 text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="flex h-14 items-center justify-center gap-3 rounded-full bg-[#1a73e8] px-4 text-base font-medium text-white hover:bg-[#1765c8] disabled:opacity-60"
            >
              <GoogleIcon />
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </button>
            <button className="flex h-14 items-center justify-center gap-3 rounded-full border border-foreground bg-background px-4 text-base font-medium hover:bg-muted">
              <Apple className="size-5 fill-current" />
              Continue with Apple
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">Don&apos;t have a TaskPay account?</p>
          <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
