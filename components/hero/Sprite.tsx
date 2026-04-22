import { ReactNode } from 'react'
import { useTime } from './TimelineContext'

interface SpriteProps {
  start: number
  end: number
  children: ReactNode
}

export default function Sprite({ start, end, children }: SpriteProps) {
  const time = useTime()
  if (time < start || time > end) return null
  return <>{children}</>
}
