import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CATEGORIES } from '@/lib/categories'
import DesignSlotEditor from '@/components/admin/DesignSlotEditor'

async function getDesigns() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!url.startsWith('https://') || url.includes('[')) return []

  const cookieStore = await cookies()
  const supabase = createServerClient(url, serviceKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll() {},
    },
  })

  const { data } = await supabase
    .from('designs')
    .select('*')
    .order('category_slug')
    .order('slot_number')

  return data ?? []
}

export default async function AdminDesignsPage() {
  const designs = await getDesigns()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Designs</h1>
      <div className="space-y-12">
        {CATEGORIES.map((category) => {
          const categoryDesigns = designs.filter(d => d.category_slug === category.slug)
          return (
            <section key={category.slug}>
              <h2 className="text-white font-semibold text-lg mb-4">{category.label}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categoryDesigns.map((design) => (
                  <DesignSlotEditor key={design.id} design={design} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
