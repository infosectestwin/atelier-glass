'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { updateDesignSlot } from '@/lib/actions/designs'
import { convertToWebP } from '@/lib/imageUtils'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'

interface Design {
  id: string
  category_slug: string
  slot_number: number
  name: string
  description: string
  materials: string
  image_url: string | null
}

interface DesignSlotEditorProps {
  design: Design
}

export default function DesignSlotEditor({ design }: DesignSlotEditorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(design.image_url)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const convertedFileRef = useRef<File | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      e.target.value = ''
      return
    }

    setError(null)
    setConverting(true)
    convertedFileRef.current = null

    try {
      const webp = await convertToWebP(file)
      convertedFileRef.current = webp
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(webp)
    } catch {
      setError('Could not process image. Try a different file.')
      e.target.value = ''
    } finally {
      setConverting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setPending(true)

    const formData = new FormData(e.currentTarget)
    // Swap in the already-converted WebP so the server always receives image/webp
    if (convertedFileRef.current) {
      formData.set('image', convertedFileRef.current)
    }

    // Guard against Vercel's 10s serverless timeout leaving the button spinning
    let timedOut = false
    const timeoutId = setTimeout(() => {
      timedOut = true
      setPending(false)
      setError('Upload timed out. Try compressing the image or converting it to WebP.')
    }, 25000)

    const result = await updateDesignSlot(formData)
    clearTimeout(timeoutId)
    if (timedOut) return

    setPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <GlassCard className="p-4">
      <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
        Slot {design.slot_number}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Hidden fields */}
        <input type="hidden" name="slotId" value={design.id} />
        <input type="hidden" name="categorySlug" value={design.category_slug} />
        <input type="hidden" name="slotNumber" value={design.slot_number} />

        {/* Image */}
        <div
          className="relative aspect-[3/4] bg-white/5 rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <Image src={imagePreview} alt={design.name} fill className="object-cover" sizes="300px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/30">
              <div className="text-center">
                <div className="text-3xl mb-1">◈</div>
                <div className="text-xs">No image</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">Change image</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Name */}
        <input
          type="text"
          name="name"
          defaultValue={design.name}
          placeholder="Design name"
          required
          className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] text-sm transition-colors"
        />

        {/* Description */}
        <textarea
          name="description"
          defaultValue={design.description}
          placeholder="Description"
          rows={2}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] text-sm transition-colors resize-none"
        />

        {/* Materials */}
        <input
          type="text"
          name="materials"
          defaultValue={design.materials}
          placeholder="Materials"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#7C3AED] text-sm transition-colors"
        />

        {/* Error / success */}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && <p className="text-green-400 text-xs">Saved!</p>}

        <Button type="submit" variant="primary" className="w-full justify-center text-sm py-2" disabled={pending || converting}>
          {converting ? 'Converting…' : pending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </GlassCard>
  )
}
