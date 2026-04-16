'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import RequestPanel from './RequestPanel'
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

interface RequestListProps {
  requests: RequestData[]
}

export default function RequestList({ requests }: RequestListProps) {
  const [selected, setSelected] = useState<RequestData | null>(null)

  return (
    <>
      <div className="space-y-2">
        {requests.length === 0 && (
          <p className="text-white/40 text-sm py-8 text-center">No requests yet.</p>
        )}
        {requests.map((req) => (
          <button
            key={req.id}
            onClick={() => setSelected(req)}
            className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{req.name}</p>
                <p className="text-white/50 text-xs truncate">{req.designs?.name ?? 'Unknown design'}</p>
                {req.note && (
                  <p className="text-white/30 text-xs mt-1 truncate">{req.note}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge variant={req.status} />
                <p className="text-white/30 text-xs">{formatDate(req.created_at)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <RequestPanel request={selected} onClose={() => setSelected(null)} />
    </>
  )
}
