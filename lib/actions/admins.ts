'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

async function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const cookieStore = await cookies()
  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll() {},
    },
  })
}

async function verifySuperAdmin(): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === process.env.SUPER_ADMIN_EMAIL
}

export async function addAdmin(formData: FormData) {
  const isSuperAdmin = await verifySuperAdmin()
  if (!isSuperAdmin) return { error: 'Not authorized.' }

  const email = (formData.get('email') as string).trim().toLowerCase()
  if (!email || !email.includes('@')) return { error: 'Invalid email address.' }

  const serviceClient = await getServiceClient()

  // Check current count (max 4 in table)
  const { count } = await serviceClient
    .from('admins')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) >= 4) {
    return { error: 'Maximum of 4 admins reached (5 total including super admin).' }
  }

  const { error } = await serviceClient.from('admins').insert({ email })
  if (error) {
    if (error.code === '23505') return { error: 'That email is already an admin.' }
    return { error: 'Failed to add admin.' }
  }

  return { success: true }
}

export async function removeAdmin(formData: FormData) {
  const isSuperAdmin = await verifySuperAdmin()
  if (!isSuperAdmin) return { error: 'Not authorized.' }

  const adminId = formData.get('adminId') as string
  if (!adminId) return { error: 'Invalid admin ID.' }

  const serviceClient = await getServiceClient()
  const { error } = await serviceClient.from('admins').delete().eq('id', adminId)
  if (error) return { error: 'Failed to remove admin.' }

  return { success: true }
}
