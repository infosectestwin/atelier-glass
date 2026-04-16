import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminNav() {
  const supabase = await createClient()
  let isSuperAdmin = false

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    isSuperAdmin = user?.email === process.env.SUPER_ADMIN_EMAIL
  }

  return (
    <aside className="w-56 shrink-0 border-r border-white/10 min-h-screen p-6">
      <nav className="space-y-1">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Admin</p>
        <Link
          href="/admin/requests"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          Requests
        </Link>
        <Link
          href="/admin/designs"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          Designs
        </Link>
        {isSuperAdmin && (
          <Link
            href="/admin/admins"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm transition-colors"
          >
            Admins
          </Link>
        )}
      </nav>
    </aside>
  )
}
