import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import RequestList from '@/components/admin/RequestList'

async function getRequests() {
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
    .from('requests')
    .select('*, designs(name, image_url)')
    .order('created_at', { ascending: false })

  return data ?? []
}

export default async function AdminRequestsPage() {
  const requests = await getRequests()

  const counts = {
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    done: requests.filter(r => r.status === 'done').length,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Requests</h1>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'New', count: counts.new, color: 'text-[#60A5FA]' },
          { label: 'Contacted', count: counts.contacted, color: 'text-[#FCD34D]' },
          { label: 'Done', count: counts.done, color: 'text-green-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Request list */}
      <RequestList requests={requests} />
    </div>
  )
}
