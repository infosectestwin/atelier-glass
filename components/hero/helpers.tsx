import { useMemo, CSSProperties } from 'react'
import { useTime } from './TimelineContext'
import { fadeBoth, fadeIn, norm, lerp, Easing } from './animations'
import { HERO_W, HERO_H } from './HeroStage'

const COLORS = {
  violet: '#7C3AED',
  coral:  '#F97316',
  cobalt: '#2563EB',
  gold:   '#D97706',
  white:  '#ffffff',
}

// Colored fashion particle field
export function ParticleField() {
  const particles = useMemo(() => {
    const rng = (seed: number) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x) }
    const palette = [COLORS.violet, COLORS.coral, COLORS.cobalt, COLORS.gold, '#ffffff']
    return Array.from({ length: 90 }, (_, i) => ({
      x: rng(i * 3.1) * HERO_W,
      y: rng(i * 7.3) * HERO_H,
      r: rng(i * 13.7) * 1.6 + 0.3,
      op: rng(i * 5.9) * 0.1 + 0.03,
      color: palette[Math.floor(rng(i * 11.3) * palette.length)],
    }))
  }, [])

  return (
    <g>
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.op} />
      ))}
    </g>
  )
}

// Text reveal, line by line (adapted TypeLabel)
interface TypeLabelProps {
  x: number
  y: number
  lines: string[]
  startT: number
  fontSize?: number
  align?: 'left' | 'center' | 'right'
  spacing?: number
  color?: string
  opacity?: number
  fontWeight?: number
  letterSpacing?: string
}

export function TypeLabel({
  x, y, lines, startT,
  fontSize = 13, align = 'left', spacing = 24,
  color = '#fff', opacity = 1,
  fontWeight = 300, letterSpacing = '0.08em',
}: TypeLabelProps) {
  const t = useTime()
  const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start'
  return (
    <g opacity={opacity}>
      {lines.map((line, li) => {
        const lStart = startT + li * 0.35
        const op = fadeBoth(t, lStart, lStart + 0.55, 999, 9999)
        return (
          <text key={li} x={x} y={y + li * spacing} textAnchor={anchor}
            fill={color} fontSize={fontSize} fontFamily="Helvetica,Arial,sans-serif"
            fontWeight={fontWeight} opacity={op}
            style={{ letterSpacing } as CSSProperties}>
            {line}
          </text>
        )
      })}
    </g>
  )
}

// Large scene title with optional subtitle
interface SceneTitleProps {
  text: string
  x: number
  y: number
  size?: number
  startT: number
  endT: number
  sub?: string
  color?: string
}

export function SceneTitle({ text, x, y, size = 52, startT, endT, sub, color = '#fff' }: SceneTitleProps) {
  const t = useTime()
  const op = fadeBoth(t, startT, startT + 0.7, endT - 0.6, endT)
  const yOff = lerp(18, 0, Easing.easeOutCubic(norm(t, startT, startT + 0.8)))
  return (
    <g opacity={op} transform={`translate(0, ${yOff})`}>
      <text x={x} y={y} textAnchor="middle" fill={color}
        fontSize={size} fontFamily="Helvetica,Arial,sans-serif"
        fontWeight={200} style={{ letterSpacing: '0.18em' } as CSSProperties}>
        {text}
      </text>
      {sub && (
        <text x={x} y={y + 42} textAnchor="middle" fill="rgba(255,255,255,0.38)"
          fontSize={11} fontFamily="Helvetica,Arial,sans-serif"
          fontWeight={300} style={{ letterSpacing: '0.22em', textTransform: 'uppercase' } as CSSProperties}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Glass-morphism fact card (matches GlassCard visual language)
interface FactCardProps {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  startT: number
  endT: number
  accentColor?: string
}

export function FactCard({ x, y, w, h, lines, startT, endT, accentColor }: FactCardProps) {
  const t = useTime()
  const op = fadeBoth(t, startT, startT + 0.55, endT - 0.5, endT)
  const scY = lerp(0.75, 1, Easing.easeOutBack(norm(t, startT, startT + 0.6)))
  return (
    <g opacity={op} style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transform: `scaleY(${scY})` } as CSSProperties}>
      <rect x={x} y={y} width={w} height={h}
        fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)"
        strokeWidth={0.8} rx={14} />
      {accentColor && (
        <rect x={x + 1} y={y + 1} width={3} height={h - 2}
          fill={accentColor} rx={2} opacity={0.65} />
      )}
      {lines.map((line, i) => (
        <text key={i} x={x + w / 2} y={y + 30 + i * 22} textAnchor="middle"
          fill={i === 0 ? '#fff' : 'rgba(255,255,255,0.45)'}
          fontSize={i === 0 ? 14 : 11}
          fontFamily="Helvetica,Arial,sans-serif"
          fontWeight={i === 0 ? 400 : 300}
          style={{ letterSpacing: i === 0 ? '0.04em' : '0.1em' } as CSSProperties}>
          {line}
        </text>
      ))}
    </g>
  )
}

// Orbiting accent dot
interface OrbiterProps {
  cx: number
  cy: number
  rx: number
  ry: number
  period: number
  startT: number
  endT: number
  r?: number
  fill?: string
}

export function Orbiter({ cx, cy, rx, ry, period, startT, endT, r = 4, fill = COLORS.coral }: OrbiterProps) {
  const t = useTime()
  const op = fadeBoth(t, startT, startT + 0.6, endT - 0.5, endT)
  const angle = ((t - startT) / period) * Math.PI * 2
  const x = cx + Math.cos(angle) * rx
  const y = cy + Math.sin(angle) * ry
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r} fill={fill} />
      <circle cx={x} cy={y} r={r + 6} fill={fill} opacity={0.2} />
    </g>
  )
}

export { COLORS }
