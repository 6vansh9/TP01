"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteAccount() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (confirm !== "DELETE") return
    setLoading(true)
    setError(null)
    const res = await fetch("/api/account/delete", { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }
    router.push("/?deleted=1")
  }

  return (
    <div className="mt-10 border border-red-100 rounded-2xl p-6 bg-red-50/40">
      <h3 className="text-base font-semibold text-red-600">Danger Zone</h3>
      <p className="text-sm text-gray-500 mt-1">
        Permanently delete your account and all associated data. This cannot be undone.
        Once deleted, you can re-register with the same email as a new user.
      </p>
      {!open ? (
        <button onClick={() => setOpen(true)}
          className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors">
          Delete my account
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">
            Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm:
          </p>
          <input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={confirm !== "DELETE" || loading}
              className="text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors">
              {loading ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button onClick={() => { setOpen(false); setConfirm("") }}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
