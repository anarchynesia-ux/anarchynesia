'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Github, AlertCircle } from 'lucide-react'
import { signInWithGitHub, signInWithGoogle } from '@/lib/auth'
import { useAuthStore } from '@/hooks/useAuth'

export default function LoginPage() {
  const t = useTranslations('login')
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGitHub()
      router.replace('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      router.replace('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh pt-14 flex items-center justify-center px-6 relative">
      {/* Atmospheric bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.06)_0%,transparent_65%)]" />

      {/* Vertical lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-void-border to-transparent opacity-30" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-void-border to-transparent opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-display text-6xl text-white mb-3 glitch" data-text="ANARCHYNESIA">
            ANARCHYNESIA
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-blood" />
            <p className="mono-label text-ash-dark tracking-widest">ACCESS TERMINAL</p>
            <div className="h-px w-8 bg-blood" />
          </div>
          <h1 className="font-ui font-light text-ash text-lg">{t('title')}</h1>
          <p className="mono-label text-void-muted mt-2">{t('subtitle')}</p>
        </div>

        {/* Auth box */}
        <div className="underground-card p-8">
          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-blood/10 border border-blood/30 p-3 mb-6 text-xs font-mono text-blood"
            >
              <AlertCircle size={12} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* GitHub button */}
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-void-lift border border-void-border text-white py-3 px-6 hover:bg-void-muted hover:border-void-muted transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github size={16} className="group-hover:scale-110 transition-transform" />
            <span className="font-ui text-sm tracking-wide">
              {loading ? t('loading') : t('github')}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-void-border" />
            <span className="mono-label text-void-muted">or</span>
            <div className="h-px flex-1 bg-void-border" />
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-void-lift border border-void-border text-white py-3 px-6 hover:bg-void-muted hover:border-void-muted transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-ui text-sm tracking-wide">
              {loading ? t('loading') : 'Continue with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6 mb-4">
            <div className="h-px flex-1 bg-void-border" />
            <span className="mono-label text-void-muted">———</span>
            <div className="h-px flex-1 bg-void-border" />
          </div>

          {/* What you get */}
          <div className="space-y-2">
            {[
              'Publish anonymous transmissions',
              'Save drafts indefinitely',
              'Build your underground archive',
              'No real name required',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blood shrink-0" />
                <p className="mono-label text-ash-dark">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mono-label text-void-muted text-center mt-6 leading-relaxed">
          {t('disclaimer')}
        </p>
      </motion.div>
    </div>
  )
}
