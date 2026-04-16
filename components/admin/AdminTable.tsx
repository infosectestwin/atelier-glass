'use client'

import { useState, useTransition } from 'react'
import { addAdmin, removeAdmin } from '@/lib/actions/admins'
import Button from '@/components/ui/Button'

interface Admin {
  id: string
  email: string
  created_at: string
}

interface AdminTableProps {
  admins: Admin[]
}

export default function AdminTable({ admins: initialAdmins }: AdminTableProps) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (admins.length >= 4) {
      setError('Maximum of 4 admins reached.')
      return
    }

    const formData = new FormData()
    formData.set('email', email)

    startTransition(async () => {
      const result = await addAdmin(formData)
      if (result.error) {
        setError(result.error)
      } else {
        // Optimistically add (will get real data on next page load)
        setAdmins(prev => [...prev, { id: crypto.randomUUID(), email: email.trim().toLowerCase(), created_at: new Date().toISOString() }])
        setEmail('')
      }
    })
  }

  function handleRemove(adminId: string) {
    const formData = new FormData()
    formData.set('adminId', adminId)

    startTransition(async () => {
      const result = await removeAdmin(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setAdmins(prev => prev.filter(a => a.id !== adminId))
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Add admin form */}
      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
          disabled={admins.length >= 4}
          className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] text-sm transition-colors disabled:opacity-40"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || admins.length >= 4}
          className="shrink-0"
        >
          Add Admin
        </Button>
      </form>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <p className="text-white/40 text-xs">{admins.length}/4 admin slots used</p>

      {/* Admin list */}
      {admins.length === 0 ? (
        <p className="text-white/40 text-sm">No additional admins yet.</p>
      ) : (
        <div className="space-y-2">
          {admins.map(admin => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <span className="text-white text-sm">{admin.email}</span>
              <Button
                variant="danger"
                onClick={() => handleRemove(admin.id)}
                disabled={isPending}
                className="text-xs px-3 py-1.5"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
