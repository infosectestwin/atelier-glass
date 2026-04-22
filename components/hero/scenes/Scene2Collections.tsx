import { CSSProperties } from 'react'
import { useTime } from '../TimelineContext'
import { fadeBoth, norm, lerp, Easing } from '../animations'
import { ParticleField, FactCard, COLORS } from '../helpers'
import { HERO_W, HERO_H } from '../HeroStage'

const CX = HERO_W / 2
const CY = HERO_H / 2

const COLLECTIONS = [
  { name: 'Collections',      slug: 'collections',      color: COLORS.violet, rx: 42, ry: 85 },
  { name: 'Couture Lab',      slug: 'couture-lab',      color: COLORS.coral,  rx: 36, ry: 78 },
  { name: 'Material Studies', slug: 'material-studies', color: COLORS.cobalt, rx: 48, ry: 90 },
  { name: 'Archive',          slug: 'archive',          color: COLORS.gold,   rx: 38, ry: 72 },
]

// x positions: spread across canvas with margin
const POSITIONS = [180, 453, 726, 1000]

export default function Scene2Collections() {
  const t = useTime()
  const S = 7, E = 15

  return (
    <g>
      <ParticleField />

      {/* Scene label */}
      <text
        x={CX} y={68}
        textAnchor="middle"
        fill="rgba(255,255,255,0.25)"
        fontSize={10} fontFamily="Helvetica,Arial,sans-serif" fontWeight={300}
        opacity={fadeBoth(t, S, S + 0.7, E - 0.5, E)}
        style={{ letterSpacing: '0.22em', textTransform: 'uppercase' } as CSSProperties}>
        Our Collections
      </text>

      {/* Horizontal connector line */}
      <line
        x1={POSITIONS[0]} y1={CY - 10}
        x2={POSITIONS[3]} y2={CY - 10}
        stroke="rgba(255,255,255,0.08)" strokeWidth={0.6}
        opacity={fadeBoth(t, S + 0.8, S + 1.4, E - 0.5, E)}
      />

      {/* Fashion silhouette arcs — one per collection */}
      {COLLECTIONS.map((col, i) => {
        const cx = POSITIONS[i]
        const cy = CY - 20
        const scaleIn = Easing.easeOutBack(norm(t, S + 0.3 + i * 0.22, S + 1.0 + i * 0.22))
        const op = fadeBoth(t, S + 0.3 + i * 0.22, S + 0.9 + i * 0.22, E - 0.5, E)

        return (
          <g key={i}>
            {/* Outer silhouette arc (dress form shape) */}
            <ellipse
              cx={cx} cy={cy}
              rx={col.rx * scaleIn} ry={col.ry * scaleIn}
              fill="none" stroke={col.color}
              strokeWidth={1.2} opacity={op * 0.7}
            />
            {/* Inner glow fill */}
            <ellipse
              cx={cx} cy={cy}
              rx={(col.rx - 2) * scaleIn} ry={(col.ry - 2) * scaleIn}
              fill={col.color} opacity={op * 0.06}
            />
            {/* Top accent dot */}
            <circle
              cx={cx} cy={cy - col.ry * scaleIn}
              r={3 * scaleIn} fill={col.color}
              opacity={op * 0.9}
            />

            {/* Collection name */}
            <text
              x={cx} y={cy + col.ry * scaleIn + 24}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize={10} fontFamily="Helvetica,Arial,sans-serif" fontWeight={300}
              opacity={fadeBoth(t, S + 0.8 + i * 0.2, S + 1.3 + i * 0.2, E - 0.5, E)}
              style={{ letterSpacing: '0.12em', textTransform: 'uppercase' } as CSSProperties}>
              {col.name}
            </text>

            {/* Slot count */}
            <text
              x={cx} y={cy + col.ry * scaleIn + 40}
              textAnchor="middle"
              fill="rgba(255,255,255,0.22)"
              fontSize={8} fontFamily="Helvetica,Arial,sans-serif" fontWeight={300}
              opacity={fadeBoth(t, S + 1.0 + i * 0.2, S + 1.5 + i * 0.2, E - 0.5, E)}
              style={{ letterSpacing: '0.1em' } as CSSProperties}>
              4 designs
            </text>
          </g>
        )
      })}

      {/* Fact card */}
      <FactCard
        x={CX - 130} y={HERO_H - 90} w={260} h={58}
        lines={['4 Collections · 16 Designs', 'Each made to order']}
        startT={S + 1.8} endT={E}
        accentColor={COLORS.violet}
      />
    </g>
  )
}
