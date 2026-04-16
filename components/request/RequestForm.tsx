'use client'

import { useState } from 'react'
import Image from 'next/image'
import { submitRequest } from '@/lib/actions/requests'
import Button from '@/components/ui/Button'
import ConfirmationMessage from './ConfirmationMessage'

interface RequestFormProps {
  design: {
    id: string
    name: string
    image_url: string | null
  }
  user: {
    name: string
    email: string
  }
}

export default function RequestForm({ design, user }: RequestFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(false)

  if (submitted) {
    return <ConfirmationMessage email={user.email} />
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const phone = formData.get('phone') as string

    // Client-side validation
    if (!phone.trim()) {
      setError('Phone number is required.')
      return
    }

    setPending(true)
    const result = await submitRequest(formData)
    setPending(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Design preview */}
      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-white/10 shrink-0">
          {design.image_url ? (
            <Image src={design.image_url} alt={design.name} fill className="object-cover" sizes="64px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xl">◈</div>
          )}
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Design</p>
          <p className="text-white font-semibold">{design.name}</p>
        </div>
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="designId" value={design.id} />
      <input type="hidden" name="designName" value={design.name} />

      {/* Pre-filled user info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-widest mb-1">Name</label>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/60 text-sm">
            {user.name}
          </div>
        </div>
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-widest mb-1">Email</label>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/60 text-sm truncate">
            {user.email}
          </div>
        </div>
      </div>

      {/* Phone — required */}
      <div>
        <label htmlFor="phone" className="block text-white/70 text-sm font-medium mb-1">
          Phone <span className="text-red-400">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+1 (555) 000-0000"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] transition-colors"
        />
      </div>

      {/* Customization note — optional */}
      <div>
        <label htmlFor="note" className="block text-white/70 text-sm font-medium mb-1">
          Customization note
          <span className="text-white/30 ml-1 font-normal">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe any customizations, sizing preferences, or special requests..."
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
        />
        <p className="text-white/30 text-xs mt-1 text-right">{note.length}/200</p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button type="submit" variant="primary" className="w-full justify-center text-base py-3" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  )
}
