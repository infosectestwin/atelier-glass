import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GlassCard from '@/components/ui/GlassCard'
import RequestForm from '@/components/request/RequestForm'

interface PageProps {
  params: Promise<{ designId: string }>
}

export default async function RequestPage({ params }: PageProps) {
  const { designId } = await params
  const supabase = await createClient()
  if (!supabase) redirect('/auth/signin')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/signin?redirectTo=/request/${designId}`)

  const { data: design } = await supabase
    .from('designs')
    .select('id, name, image_url')
    .eq('id', designId)
    .single()

  if (!design) notFound()

  const userName = user.user_metadata?.full_name ?? user.email ?? 'Guest'
  const userEmail = user.email ?? ''

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">Request a Design</h1>
      <GlassCard className="p-6">
        <RequestForm
          design={design}
          user={{ name: userName, email: userEmail }}
        />
      </GlassCard>
    </div>
  )
}
