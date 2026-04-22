import { createClient } from '@/lib/supabase/server'
import FeaturedGallery from '@/components/gallery/FeaturedGallery'
import HeroAnimation from '@/components/hero/HeroAnimation'
import { CATEGORIES } from '@/lib/categories'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch first slot from each category (featured designs)
  const { data: designs } = supabase
    ? await supabase
        .from('designs')
        .select('id, name, image_url, category_slug')
        .in('category_slug', CATEGORIES.map(c => c.slug))
        .eq('slot_number', 1)
        .order('category_slug')
    : { data: null }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Animated hero */}
      <div className="mb-16 -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl overflow-hidden">
        <HeroAnimation />
      </div>

      {/* Featured gallery */}
      <FeaturedGallery designs={designs || []} />
    </div>
  )
}
