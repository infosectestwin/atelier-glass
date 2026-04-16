import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/categories'
import DesignGrid from '@/components/gallery/DesignGrid'
import DesignCard from '@/components/gallery/DesignCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = CATEGORIES.find(c => c.slug === slug)
  if (!category) notFound()

  const supabase = await createClient()
  const { data: designs } = supabase
    ? await supabase
        .from('designs')
        .select('id, name, image_url, category_slug, slot_number')
        .eq('category_slug', slug)
        .order('slot_number')
        .limit(4)
    : { data: null }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">{category.label}</h1>
      <p className="text-white/50 mb-10">Explore all designs in this collection.</p>
      {designs && designs.length > 0 ? (
        <DesignGrid>
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </DesignGrid>
      ) : (
        <p className="text-white/40">No designs in this category yet.</p>
      )}
    </div>
  )
}
