import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import GlassCard from '@/components/ui/GlassCard'
import AdminTable from '@/components/admin/AdminTable'

async function getAdmins() {
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
    .from('admins')
    .select('*')
    .order('created_at')

  return data ?? []
}

export default async function AdminAdminsPage() {
  // Only super admin can access this page
  const supabase = await createClient()
  if (!supabase) redirect('/admin/requests')

  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect('/admin/requests')
  }

  const admins = await getAdmins()

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-2">Admin Management</h1>
      <p className="text-white/40 text-sm mb-8">
        Add or remove admins. Maximum 4 additional admins (5 total including you).
      </p>
      <GlassCard className="p-6">
        <AdminTable admins={admins} />
      </GlassCard>
    </div>
  )
}
