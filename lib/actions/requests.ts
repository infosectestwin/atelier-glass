'use server'

import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sanitizeInput, isValidPhone } from '@/lib/utils'
import { sendConfirmationEmail } from '@/lib/email'

export async function submitRequest(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return { error: 'Service not configured.' }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to submit a request.' }

  const designId = formData.get('designId') as string
  const designName = formData.get('designName') as string
  const phone = formData.get('phone') as string
  const note = formData.get('note') as string

  // Validate phone
  if (!phone || !isValidPhone(phone)) {
    return { error: 'Please enter a valid phone number.' }
  }

  // Sanitize text inputs
  const sanitizedPhone = sanitizeInput(phone)
  const sanitizedNote = note ? sanitizeInput(note).slice(0, 200) : null
  const sanitizedName = sanitizeInput(user.user_metadata?.full_name ?? user.email ?? '')

  // Insert using service role to bypass RLS
  const cookieStore = await cookies()
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { error } = await serviceClient.from('requests').insert({
    design_id: designId,
    user_id: user.id,
    name: sanitizedName,
    email: user.email!,
    phone: sanitizedPhone,
    note: sanitizedNote,
    status: 'new',
  })

  if (error) {
    console.error('Insert error:', error)
    return { error: 'Failed to submit request. Please try again.' }
  }

  // Send confirmation email (non-blocking)
  await sendConfirmationEmail({
    to: user.email!,
    name: sanitizedName,
    designName: sanitizeInput(designName),
  })

  return { success: true }
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: 'new' | 'contacted' | 'done'
) {
  const supabase = await createClient()
  if (!supabase) return { error: 'Service not configured.' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  // Verify admin
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
  let isAdmin = user.email === superAdminEmail

  if (!isAdmin) {
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await serviceClient.from('admins').select('id').eq('email', user.email).single()
    isAdmin = !!data
  }

  if (!isAdmin) return { error: 'Not authorized.' }

  const { createServerClient } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { error } = await serviceClient
    .from('requests')
    .update({ status: newStatus })
    .eq('id', requestId)

  if (error) return { error: 'Failed to update status.' }
  return { success: true }
}
