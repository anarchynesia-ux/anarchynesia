'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Twitter, Link2 } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PostActionsProps {
  title: string
  slug: string
  className?: string
}

export function PostActions({ title, slug, className }: PostActionsProps) {
  const [copied, setCopied] = useState(false)

  const url =
    typeof window !== 'undefined'
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL}/journal/${slug}`

  const handleCopy = async () => {
    await copyToClipboard(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleTwitter = () => {
    const text = encodeURIComponent(`"${title}" — ANARCHYNESIA`)
    const link = encodeURIComponent(url)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${link}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="mono-label text-void-muted mr-1 tracking-widest hidden sm:inline">SHARE</span>

      <ActionButton
        onClick={handleCopy}
        title="Copy link"
        active={copied}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5 text-blood"
            >
              <Check size={11} />
              <span className="mono-label">Copied</span>
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <Copy size={11} />
              <span className="mono-label hidden sm:inline">Copy Link</span>
            </motion.span>
          )}
        </AnimatePresence>
      </ActionButton>

      <ActionButton onClick={handleTwitter} title="Share on X (Twitter)">
        <Twitter size={11} />
        <span className="mono-label hidden sm:inline">Share</span>
      </ActionButton>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  title,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 border mono-label transition-all',
        active
          ? 'border-blood/40 text-blood bg-blood/5'
          : 'border-void-border text-ash-dark hover:border-void-muted hover:text-ash'
      )}
    >
      {children}
    </button>
  )
}
