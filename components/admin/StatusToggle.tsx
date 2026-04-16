'use client'

import { useState, useTransition } from 'react'
import { updateRequestStatus } from '@/lib/actions/requests'
import Badge from '@/components/ui/Badge'

type Status = 'new' | 'contacted' | 'done'

const nextStatus: Record<Status, Status> = {
  new: 'contacted',
  contacted: 'done',
  done: 'new',
}

interface StatusToggleProps {
  requestId: string
  initialStatus: Status
  onStatusChange?: (newStatus: Status) => void
}

export default function StatusToggle({ requestId, initialStatus, onStatusChange }: StatusToggleProps) {
  const [status, setStatus] = useState<Status>(initialStatus)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    const next = nextStatus[status]
    setStatus(next) // optimistic update
    onStatusChange?.(next)
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, next)
      if (result.error) {
        setStatus(status) // revert on error
        onStatusChange?.(status)
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title="Click to advance status"
      className="cursor-pointer disabled:opacity-50 transition-opacity"
    >
      <Badge variant={status} />
    </button>
  )
}
