'use client'

import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { Suspense } from 'react'

function SignInContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  async function handleGoogleSignIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-white/50 text-sm mb-8">Sign in to submit a customization request.</p>
        <Button variant="primary" className="w-full justify-center" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
      </GlassCard>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}
