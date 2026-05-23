'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const t = useTranslations('notFound')

  return (
    <div className="min-h-dvh pt-14 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.05)_0%,transparent_65%)]" />

      {/* Background 404 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[40vw] leading-none text-void-lift/30 opacity-40">
          404
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center max-w-lg"
      >
        <p className="mono-label text-blood mb-4 tracking-widest">SIGNAL LOST</p>
        <h1 className="font-display text-8xl md:text-[10rem] text-white leading-none mb-4 glitch" data-text="404">
          {t('title')}
        </h1>
        <p className="font-display text-2xl text-ash mb-3">{t('subtitle')}</p>
        <p className="font-body text-ash-dark mb-10 leading-relaxed">{t('description')}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-blood inline-flex items-center gap-2 group justify-center">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            {t('back')}
          </Link>
          <Link href="/journal" className="btn-ghost justify-center">
            Browse Journal
          </Link>
        </div>

        <div className="mt-16">
          <div className="h-px w-24 bg-blood mx-auto mb-4" />
          <p className="mono-label text-void-muted">
            If you believe this is an error, the transmission may have been removed.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
