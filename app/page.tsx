import { createClient } from '@/lib/supabase/server'
import FeaturedGallery from '@/components/gallery/FeaturedGallery'
import { CATEGORIES } from '@/lib/categories'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch first slot from each category (featured designs)
  const { data: designs } = await supabase
    .from('designs')
    .select('id, name, image_url, category_slug')
    .in('category_slug', CATEGORIES.map(c => c.slug))
    .eq('slot_number', 1)
    .order('category_slug')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 tracking-tight">
          Atelier Glass
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Original designs. Commission yours.
        </p>
      </div>

      {/* Featured gallery */}
      <FeaturedGallery designs={designs || []} />
    </div>
  )
}
