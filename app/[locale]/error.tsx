'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[ANARCHYNESIA ERROR]', error)
  }, [error])

  return (
    <div className="min-h-dvh pt-14 flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.04)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md relative"
      >
        <p className="mono-label text-blood mb-4 tracking-widest">TRANSMISSION ERROR</p>
        <h1 className="font-display text-7xl text-white mb-4">ERROR</h1>
        <p className="font-body text-ash mb-2">Something went wrong in the archive.</p>
        <p className="mono-label text-void-muted mb-10 text-[10px]">
          {error.message || 'Unknown error'}
          {error.digest && ` · ${error.digest}`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-blood">
            Try Again
          </button>
          <a href="/" className="btn-ghost">
            Return Home
          </a>
        </div>
      </motion.div>
    </div>
  )
}
