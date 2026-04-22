export type EasingFn = (t: number) => number

export const Easing = {
  linear:         (t: number) => t,
  easeInCubic:    (t: number) => t * t * t,
  easeOutCubic:   (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutExpo:    (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo:  (t: number) => {
    if (t === 0) return 0
    if (t === 1) return 1
    return t < 0.5 ? 0.5 * Math.pow(2, 20 * t - 10) : 1 - 0.5 * Math.pow(2, -20 * t + 10)
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158, c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
} satisfies Record<string, EasingFn>

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clampT(t: number): number {
  return Math.max(0, Math.min(1, t))
}

export function norm(t: number, s: number, e: number): number {
  return clampT((t - s) / (e - s))
}

export function fadeIn(t: number, s: number, e: number, ease: EasingFn = Easing.easeOutCubic): number {
  return ease(norm(t, s, e))
}

export function fadeOut(t: number, s: number, e: number, ease: EasingFn = Easing.easeInCubic): number {
  return 1 - ease(norm(t, s, e))
}

export function fadeBoth(t: number, inS: number, inE: number, outS: number, outE: number): number {
  if (t < inE) return fadeIn(t, inS, inE)
  if (t > outS) return fadeOut(t, outS, outE)
  return 1
}
