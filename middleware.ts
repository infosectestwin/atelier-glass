import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  // If env vars not configured, skip protection
  if (!url.startsWith('https://') || url.includes('[')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /request/* — redirect to sign-in if not authenticated
  if (pathname.startsWith('/request/')) {
    if (!user) {
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect /admin/* — check admin status
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    const isSuperAdmin = user.email === superAdminEmail

    if (!isSuperAdmin) {
      // Check admins table using service role key
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
      const serviceClient = createServerClient(url, serviceKey, {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      })
      const { data: adminRow } = await serviceClient
        .from('admins')
        .select('id')
        .eq('email', user.email)
        .single()

      if (!adminRow) {
        return NextResponse.redirect(new URL('/', request.url))
      }

      // Regular admin cannot access /admin/admins
      if (pathname.startsWith('/admin/admins')) {
        return NextResponse.redirect(new URL('/admin/requests', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/request/:path*', '/admin/:path*'],
}
