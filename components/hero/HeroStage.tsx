'use client'

import { useRef, useEffect, useState, useMemo, ReactNode } from 'react'
import { TimelineContext } from './TimelineContext'

export const HERO_W = 1280
export const HERO_H = 480

interface HeroStageProps {
  duration: number
  children: ReactNode
}

export default function HeroStage({ duration, children }: HeroStageProps) {
  const [time, setTime] = useState(0)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / HERO_W)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setTime(t => (t + dt) % duration)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [duration])

  const ctxValue = useMemo(() => ({ time, duration }), [time, duration])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: HERO_H * scale, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        width: HERO_W,
        height: HERO_H,
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}>
        <TimelineContext.Provider value={ctxValue}>
          {children}
        </TimelineContext.Provider>
      </div>
    </div>
  )
}
