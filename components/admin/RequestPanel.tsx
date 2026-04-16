'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import GlassCard from '@/components/ui/GlassCard'
import StatusToggle from './StatusToggle'
import { formatDate } from '@/lib/utils'

type Status = 'new' | 'contacted' | 'done'

interface RequestData {
  id: string
  name: string
  email: string
  phone: string
  note: string | null
  status: Status
  created_at: string
  designs?: { name: string; image_url: string | null } | null
}

interface RequestPanelProps {
  request: RequestData | null
  onClose: () => void
}

export default function RequestPanel({ request, onClose }: RequestPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [currentStatus, setCurrentStatus] = useState<Status>(request?.status ?? 'new')

  useEffect(() => {
    if (request) setCurrentStatus(request.status)
  }, [request])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const isOpen = !!request

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <GlassCard className="h-full rounded-none rounded-l-2xl overflow-y-auto p-6 flex flex-col gap-6">
          {request && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between">
                <h2 className="text-white font-bold text-lg">{request.name}</h2>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white text-xl leading-none ml-4"
                >
                  ×
                </button>
              </div>

              {/* Design */}
              {request.designs && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    {request.designs.image_url ? (
                      <Image src={request.designs.image_url} alt={request.designs.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/30">◈</div>
                    )}
                  </div>
                  <p className="text-white font-medium text-sm">{request.designs.name}</p>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs uppercase tracking-widest">Status</span>
                <StatusToggle
                  requestId={request.id}
                  initialStatus={currentStatus}
                  onStatusChange={setCurrentStatus}
                />
              </div>

              {/* Contact details */}
              <div className="space-y-3">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-white text-sm">{request.email}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-white text-sm">{request.phone}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Submitted</p>
                  <p className="text-white text-sm">{formatDate(request.created_at)}</p>
                </div>
              </div>

              {/* Note */}
              {request.note && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Customization note</p>
                  <p className="text-white/80 text-sm leading-relaxed bg-white/5 rounded-xl p-3">
                    {request.note}
                  </p>
                </div>
              )}

              {/* Reply button */}
              <a
                href={`mailto:${request.email}?subject=Re: Your customization request for ${encodeURIComponent(request.designs?.name ?? 'your design')}`}
                className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200 text-sm"
              >
                Reply via Email
              </a>
            </>
          )}
        </GlassCard>
      </div>
    </>
  )
}
