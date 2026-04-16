import { ReactNode } from 'react'

interface DesignGridProps {
  children: ReactNode
}

export default function DesignGrid({ children }: DesignGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {children}
    </div>
  )
}
