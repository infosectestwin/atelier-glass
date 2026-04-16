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

async function verifyAdmin(): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  if (user.email === process.env.SUPER_ADMIN_EMAIL) return true

  const serviceClient = await getServiceClient()
  const { data } = await serviceClient
    .from('admins')
    .select('id')
    .eq('email', user.email)
    .single()

  return !!data
}

export async function updateDesignSlot(formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) return { error: 'Not authorized.' }

  const slotId = formData.get('slotId') as string
  const categorySlug = formData.get('categorySlug') as string
  const slotNumber = formData.get('slotNumber') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const materials = formData.get('materials') as string
  const imageFile = formData.get('image') as File | null

  const serviceClient = await getServiceClient()

  let imageUrl: string | undefined

  // Upload image if provided
  if (imageFile && imageFile.size > 0) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      return { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
    }

    // Validate file size (5MB max)
    if (imageFile.size > 5 * 1024 * 1024) {
      return { error: 'File too large. Maximum size is 5MB.' }
    }

    const ext = imageFile.type === 'image/webp' ? 'webp' : imageFile.type === 'image/png' ? 'png' : 'jpg'
    const path = `${categorySlug}/${slotNumber}.${ext}`

    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await serviceClient.storage
      .from('design-images')
      .upload(path, buffer, {
        contentType: imageFile.type,
        upsert: true, // overwrite existing
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: 'Failed to upload image.' }
    }

    const { data: { publicUrl } } = serviceClient.storage
      .from('design-images')
      .getPublicUrl(path)

    // Add cache-busting query param so Next.js Image picks up the new image
    imageUrl = `${publicUrl}?t=${Date.now()}`
  }

  // Update design row
  const updateData: Record<string, string> = { name, description, materials }
  if (imageUrl) updateData.image_url = imageUrl

  const { error } = await serviceClient
    .from('designs')
    .update(updateData)
    .eq('id', slotId)

  if (error) {
    console.error('Update error:', error)
    return { error: 'Failed to save design.' }
  }

  return { success: true }
}
