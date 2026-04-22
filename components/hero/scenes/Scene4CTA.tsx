import { CSSProperties } from 'react'
import { useTime } from '../TimelineContext'
import { fadeBoth, norm, Easing } from '../animations'
import { ParticleField, COLORS } from '../helpers'
import { HERO_W, HERO_H } from '../HeroStage'

const CX = HERO_W / 2
const CY = HERO_H / 2

export default function Scene4CTA() {
  const t = useTime()
  const S = 20, E = 24

  // Pulsing gold dot
  const pulse = 0.65 + 0.35 * Math.sin((t - S) * 2.5)
  const dotOp = fadeBoth(t, S + 0.4, S + 1.0, E - 0.8, E)

  // Text fade
  const textOp = fadeBoth(t, S + 0.8, S + 1.5, E - 0.6, E)

  // Expanding ring fades in then out with the scene
  const ringExpand = Easing.easeOutExpo(norm(t, S + 0.2, S + 1.4))
  const ringOp     = fadeBoth(t, S + 0.2, S + 0.8, E - 0.8, E)

  return (
    <g>
      <ParticleField />

      {/* Expanding invitation ring — gold */}
      {[1.0, 1.6, 2.4].map((scale, i) => (
        <circle key={i}
          cx={CX} cy={CY}
          r={ringExpand * scale * 80}
          fill="none" stroke={COLORS.gold}
          strokeWidth={0.8 - i * 0.2}
          opacity={ringOp * (0.18 - i * 0.04)}
        />
      ))}

      {/* Central pulsing gold dot */}
      <g opacity={dotOp}>
        <circle cx={CX} cy={CY} r={5 * pulse} fill={COLORS.gold} />
        <circle cx={CX} cy={CY} r={16 * pulse} fill={COLORS.gold} opacity={0.12} />
        <circle cx={CX} cy={CY} r={30 * pulse} fill={COLORS.gold} opacity={0.05} />
      </g>

      {/* CTA text */}
      <g opacity={textOp}>
        <text x={CX} y={CY - 50}
          textAnchor="middle"
          fill="rgba(255,255,255,0.85)"
          fontSize={36} fontFamily="Helvetica,Arial,sans-serif" fontWeight={200}
          style={{ letterSpacing: '0.2em' } as CSSProperties}>
          BEGIN YOUR COMMISSION
        </text>
        <text x={CX} y={CY - 10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.28)"
          fontSize={11} fontFamily="Helvetica,Arial,sans-serif" fontWeight={300}
          style={{ letterSpacing: '0.18em', textTransform: 'uppercase' } as CSSProperties}>
          Explore the gallery below
        </text>
      </g>

      {/* Subtle downward arrow hint */}
      <g opacity={fadeBoth(t, S + 1.6, S + 2.2, E - 0.5, E)}>
        <line x1={CX} y1={CY + 50} x2={CX} y2={CY + 78}
          stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
        <polyline
          points={`${CX - 8},${CY + 68} ${CX},${CY + 80} ${CX + 8},${CY + 68}`}
          fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}
        />
      </g>
    </g>
  )
}
