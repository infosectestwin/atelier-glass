import DesignGrid from './DesignGrid'
import DesignCard from './DesignCard'

interface Design {
  id: string
  name: string
  image_url: string | null
  category_slug: string
}

interface FeaturedGalleryProps {
  designs: Design[]
}

export default function FeaturedGallery({ designs }: FeaturedGalleryProps) {
  return (
    <section>
      <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-6">
        Featured Designs
      </h2>
      <DesignGrid>
        {designs.map((design, i) => (
          <DesignCard key={design.id} design={design} priority={i === 0} />
        ))}
      </DesignGrid>
    </section>
  )
}
