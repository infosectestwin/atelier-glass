import { CSSProperties } from 'react'
import { useTime } from '../TimelineContext'
import { fadeBoth, norm, Easing } from '../animations'
import { ParticleField, TypeLabel, Orbiter, COLORS } from '../helpers'
import { HERO_W, HERO_H } from '../HeroStage'

const CX = HERO_W / 2
const CY = HERO_H / 2

export default function Scene3Craft() {
  const t = useTime()
  const S = 14, E = 21

  // Central silhouette scales in
  const scaleIn = Easing.easeOutBack(norm(t, S + 0.2, S + 1.1))
  const bodyOp  = fadeBoth(t, S + 0.2, S + 0.9, E - 0.6, E)

  // Measurement line reveal progress
  const lineP = Easing.easeOutCubic(norm(t, S + 0.8, S + 1.6))

  return (
    <g>
      <ParticleField />

      {/* Central fashion form — layered ellipses suggesting a dress silhouette */}
      <g opacity={bodyOp}>
        {/* Outer glow */}
        <ellipse cx={CX} cy={CY - 10} rx={80 * scaleIn} ry={140 * scaleIn}
          fill="none" stroke={COLORS.violet} strokeWidth={0.5} opacity={0.2} />
        {/* Main form */}
        <ellipse cx={CX} cy={CY - 10} rx={58 * scaleIn} ry={120 * scaleIn}
          fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
        {/* Inner shoulder/bodice shape */}
        <ellipse cx={CX} cy={CY - 70 * scaleIn} rx={32 * scaleIn} ry={40 * scaleIn}
          fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={0.7} />
        {/* Subtle fill */}
        <ellipse cx={CX} cy={CY - 10} rx={56 * scaleIn} ry={118 * scaleIn}
          fill={COLORS.violet} opacity={0.04} />
      </g>

      {/* Measurement lines — vertical (height indicator) */}
      <g opacity={fadeBoth(t, S + 0.8, S + 1.4, E - 0.5, E)}>
        <line
          x1={CX + 90} y1={CY - 130 * lineP}
          x2={CX + 90} y2={CY + 130 * lineP}
          stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} strokeDasharray="3 5"
        />
        <line x1={CX + 86} y1={CY - 130} x2={CX + 94} y2={CY - 130}
          stroke="rgba(255,255,255,0.3)" strokeWidth={0.8}
          opacity={lineP > 0.95 ? 1 : 0}
        />
        <line x1={CX + 86} y1={CY + 130} x2={CX + 94} y2={CY + 130}
          stroke="rgba(255,255,255,0.3)" strokeWidth={0.8}
          opacity={lineP > 0.95 ? 1 : 0}
        />
        <text x={CX + 102} y={CY + 4}
          fill="rgba(255,255,255,0.25)" fontSize={8}
          fontFamily="Helvetica,Arial,sans-serif" fontWeight={300}
          textAnchor="start" opacity={lineP > 0.95 ? fadeBoth(t, S + 1.8, S + 2.2, E - 0.5, E) : 0}
          style={{ letterSpacing: '0.1em' } as CSSProperties}>
          BESPOKE
        </text>
      </g>

      {/* Orbiting coral dot */}
      <Orbiter
        cx={CX} cy={CY - 10} rx={100} ry={55}
        period={5} startT={S + 0.6} endT={E}
        r={4} fill={COLORS.coral}
      />

      {/* Editorial copy — right side */}
      <TypeLabel
        x={CX + 200} y={CY - 60}
        lines={['Hand-crafted.', 'Made to order.', 'Commission yours.']}
        startT={S + 1.2}
        fontSize={18} align="left" spacing={34}
        color="rgba(255,255,255,0.75)"
        fontWeight={200} letterSpacing="0.1em"
      />

      {/* Fine print */}
      <TypeLabel
        x={CX + 200} y={CY + 80}
        lines={['Every piece begins with your vision.']}
        startT={S + 2.4}
        fontSize={11} align="left"
        color="rgba(255,255,255,0.3)"
        fontWeight={300} letterSpacing="0.06em"
      />

      {/* Gold accent line — left of text */}
      <line
        x1={CX + 190} y1={CY - 70}
        x2={CX + 190} y2={CY + 50}
        stroke={COLORS.gold} strokeWidth={1}
        opacity={fadeBoth(t, S + 1.0, S + 1.6, E - 0.5, E) * 0.5}
      />
    </g>
  )
}
