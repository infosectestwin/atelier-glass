import { createContext, useContext } from 'react'

export interface TimelineContextValue {
  time: number
  duration: number
}

export const TimelineContext = createContext<TimelineContextValue>({ time: 0, duration: 24 })

export function useTime(): number {
  return useContext(TimelineContext).time
}
