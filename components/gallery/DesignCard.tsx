import Image from 'next/image'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface DesignCardProps {
  design: {
    id: string
    name: string
    image_url: string | null
    category_slug: string
  }
  priority?: boolean
}

export default function DesignCard({ design, priority = false }: DesignCardProps) {
  return (
    <GlassCard className="overflow-hidden flex flex-col">
      {/* Image area — links to design detail */}
      <Link href={`/design/${design.id}`} className="block">
        <div className="relative aspect-[3/4] bg-white/5">
          {design.image_url ? (
            <Image
              src={design.image_url}
              alt={design.name}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/30 text-center p-4">
                <div className="text-4xl mb-2">◈</div>
                <div className="text-sm">Design coming soon</div>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Card footer */}
      <div className="p-4 flex items-center justify-between gap-3">
        <Link href={`/design/${design.id}`} className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate hover:text-white/80 transition-colors">
            {design.name}
          </h3>
        </Link>
        <Link href={`/request/${design.id}`}>
          <Button variant="primary" className="text-xs px-4 py-2 shrink-0">
            Request
          </Button>
        </Link>
      </div>
    </GlassCard>
  )
}
