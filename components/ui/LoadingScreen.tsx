'use client'

import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Retrieving transmission...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center">
      {/* Scanlines overlay */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        {/* Animated logo */}
        <motion.p
          className="font-display text-4xl md:text-6xl text-white mb-6 tracking-wider"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ANARCHYNESIA
        </motion.p>

        {/* Blood line loader */}
        <div className="w-48 h-px bg-void-border mx-auto mb-4 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blood"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '40%' }}
          />
        </div>

        <p className="mono-label text-void-muted tracking-widest">{message}</p>
      </motion.div>
    </div>
  )
}

// Inline skeleton for content areas
export function PostSkeleton() {
  return (
    <div className="underground-card p-6 min-h-[200px] animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-2 w-20 bg-void-border rounded-none" />
        <div className="h-2 w-10 bg-void-border rounded-none" />
      </div>
      <div className="h-6 w-3/4 bg-void-border rounded-none mb-3" />
      <div className="h-3 w-full bg-void-border rounded-none mb-2 opacity-60" />
      <div className="h-3 w-5/6 bg-void-border rounded-none mb-2 opacity-60" />
      <div className="h-3 w-4/6 bg-void-border rounded-none opacity-40" />
      <div className="flex gap-2 mt-6">
        <div className="h-4 w-14 bg-void-border rounded-none" />
        <div className="h-4 w-14 bg-void-border rounded-none" />
      </div>
    </div>
  )
}

export function FeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-void-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-void">
          <PostSkeleton />
        </div>
      ))}
    </div>
  )
}
