import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from './SignOutButton'

async function getAuthState() {
  const supabase = await createClient()
  if (!supabase) return { user: null, isAdmin: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, isAdmin: false }

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
  if (user.email === superAdminEmail) return { user, isAdmin: true }

  // Check admins table using service role
  const { createServerClient: createSvc } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const serviceClient = createSvc(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
  const { data: adminRow } = await serviceClient
    .from('admins')
    .select('id')
    .eq('email', user.email ?? '')
    .single()

  return { user, isAdmin: !!adminRow }
}

export default async function Navbar() {
  const { user, isAdmin } = await getAuthState()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-white font-bold text-xl tracking-tight">
            Atelier Glass
          </Link>

          {/* Category links */}
          <div className="hidden sm:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin/requests"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Admin
              </Link>
            )}
            {user ? (
              <SignOutButton />
            ) : (
              <Link
                href="/auth/signin"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile category links */}
        <div className="sm:hidden flex gap-4 pb-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-white/70 hover:text-white text-sm font-medium whitespace-nowrap transition-colors duration-200"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
