import { CSSProperties } from 'react'
import { useTime } from '../TimelineContext'
import { fadeBoth, norm, Easing } from '../animations'
import { ParticleField, SceneTitle, COLORS } from '../helpers'
import { HERO_W, HERO_H } from '../HeroStage'

const CX = HERO_W / 2
const CY = HERO_H / 2

const CATEGORIES = [
  { name: 'Collections',      color: COLORS.violet },
  { name: 'Couture Lab',      color: COLORS.coral  },
  { name: 'Material Studies', color: COLORS.cobalt },
  { name: 'Archive',          color: COLORS.gold   },
]

export default function Scene1Brand() {
  const t = useTime()
  const S = 0, E = 8

  // Rings expand outward from center
  const expand = Easing.easeOutExpo(norm(t, S, S + 2.8))

  return (
    <g>
      <ParticleField />

      {/* Expanding violet accent rings */}
      {[0.35, 0.65, 1.0].map((scale, i) => {
        const r = expand * scale * 320
        const op = fadeBoth(t, S, S + 0.4, E - 0.6, E)
        return (
          <circle key={i} cx={CX} cy={CY} r={r}
            fill="none" stroke={COLORS.violet}
            strokeWidth={1.2 - i * 0.3}
            opacity={op * (0.22 - i * 0.06)} />
        )
      })}

      {/* Brand title */}
      <SceneTitle
        text="ATELIER GLASS"
        x={CX} y={CY - 20}
        size={86}
        startT={S + 0.25} endT={E}
        sub="original designs · commission yours"
      />

      {/* Thin divider line */}
      <line
        x1={CX - 160} y1={CY + 55} x2={CX + 160} y2={CY + 55}
        stroke="rgba(255,255,255,0.15)" strokeWidth={0.6}
        opacity={fadeBoth(t, S + 1.4, S + 1.9, E - 0.5, E)}
      />

      {/* Collection color indicators */}
      {CATEGORIES.map((cat, i) => {
        const xPos = CX - 285 + i * 190
        const dotOp = fadeBoth(t, S + 1.8 + i * 0.22, S + 2.4 + i * 0.22, E - 0.5, E)
        return (
          <g key={i} opacity={dotOp}>
            <circle cx={xPos} cy={CY + 90} r={3.5} fill={cat.color} opacity={0.85} />
            <text
              x={xPos + 12} y={CY + 95}
              fill="rgba(255,255,255,0.32)"
              fontSize={9} fontFamily="Helvetica,Arial,sans-serif" fontWeight={300}
              style={{ letterSpacing: '0.14em', textTransform: 'uppercase' } as CSSProperties}>
              {cat.name}
            </text>
          </g>
        )
      })}
    </g>
  )
}
