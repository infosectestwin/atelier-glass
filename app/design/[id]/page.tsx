import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/categories'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: design } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single()

  if (!design) notFound()

  const category = CATEGORIES.find(c => c.slug === design.category_slug)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href={`/category/${design.category_slug}`}
        className="text-white/50 hover:text-white text-sm mb-8 inline-flex items-center gap-1 transition-colors"
      >
        ← {category?.label ?? 'Back'}
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <GlassCard className="overflow-hidden">
          <div className="relative aspect-[3/4] bg-white/5">
            {design.image_url ? (
              <Image
                src={design.image_url}
                alt={design.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/30 text-center">
                  <div className="text-6xl mb-2">◈</div>
                  <div className="text-sm">Design coming soon</div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">{design.name}</h1>
            {design.description && (
              <p className="text-white/70 mb-4 leading-relaxed">{design.description}</p>
            )}
            {design.materials && (
              <div className="mb-6">
                <h3 className="text-white/40 text-xs uppercase tracking-widest mb-1">Materials</h3>
                <p className="text-white/70 text-sm">{design.materials}</p>
              </div>
            )}
          </div>

          <Link href={`/request/${design.id}`}>
            <Button variant="primary" className="w-full justify-center text-base py-3">
              Request This Design
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
