'use client'

import HeroStage, { HERO_W, HERO_H } from './HeroStage'
import Sprite from './Sprite'
import Scene1Brand from './scenes/Scene1Brand'
import Scene2Collections from './scenes/Scene2Collections'
import Scene3Craft from './scenes/Scene3Craft'
import Scene4CTA from './scenes/Scene4CTA'

// 24-second loop: Brand → Collections → Craft → CTA → loops back
const DURATION = 24

export default function HeroAnimation() {
  return (
    <HeroStage duration={DURATION}>
      <svg
        width={HERO_W}
        height={HERO_H}
        viewBox={`0 0 ${HERO_W} ${HERO_H}`}
        style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
      >
        {/* Dark gradient background matching the site body */}
        <defs>
          <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0f0f1a" />
            <stop offset="30%"  stopColor="#1a0f2e" />
            <stop offset="60%"  stopColor="#0f1a2e" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </linearGradient>
        </defs>
        <rect width={HERO_W} height={HERO_H} fill="url(#heroBg)" />

        {/* Scenes overlap by 1s for smooth crossfades */}
        <Sprite start={0}  end={8}><Scene1Brand /></Sprite>
        <Sprite start={7}  end={15}><Scene2Collections /></Sprite>
        <Sprite start={14} end={21}><Scene3Craft /></Sprite>
        <Sprite start={20} end={24}><Scene4CTA /></Sprite>
      </svg>
    </HeroStage>
  )
}
