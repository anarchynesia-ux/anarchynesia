'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Search, X, Filter } from 'lucide-react'
import { getPublishedPosts, searchPosts, getPostsByTag } from '@/lib/firestore'
import { Post } from '@/types'
import { JournalCard } from '@/components/journal/JournalCard'
import { cn } from '@/lib/utils'

const POPULAR_TAGS = [
  'manifesto', 'resistance', 'digital', 'underground', 'anonymous',
  'politics', 'culture', 'technology', 'art', 'poetry',
]

export default function JournalPage() {
  const t = useTranslations('journal')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const { posts } = await getPublishedPosts(24)
      setPosts(posts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setActiveTag(null)
      loadPosts()
      return
    }
    setSearching(true)
    try {
      const results = await searchPosts(q)
      setPosts(results)
    } finally {
      setSearching(false)
    }
  }, [loadPosts])

  const handleTagFilter = useCallback(async (tag: string | null) => {
    setActiveTag(tag)
    setQuery('')
    if (!tag) { loadPosts(); return }
    setLoading(true)
    try {
      const results = await getPostsByTag(tag)
      setPosts(results)
    } finally {
      setLoading(false)
    }
  }, [loadPosts])

  useEffect(() => {
    const timer = setTimeout(() => { if (query) handleSearch(query) }, 400)
    return () => clearTimeout(timer)
  }, [query, handleSearch])

  return (
    <div className="pt-14 min-h-dvh">
      {/* Header */}
      <div className="border-b border-void-border bg-void-soft">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mono-label text-blood mb-3 tracking-widest">TRANSMISSIONS</p>
            <h1 className="font-display text-6xl md:text-8xl text-white leading-[0.9]">
              {t('title')}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="border-b border-void-border bg-void sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              className="input-underground pl-9 pr-8 py-2 text-sm h-9"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); loadPosts() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-void-muted hover:text-ash transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Tag filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1">
            <button
              onClick={() => handleTagFilter(null)}
              className={cn('tag-chip shrink-0', activeTag === null && 'active')}
            >
              {t('all')}
            </button>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag === activeTag ? null : tag)}
                className={cn('tag-chip shrink-0', activeTag === tag && 'active')}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading || searching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-void-border">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-void-soft h-64 loading-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="font-display text-4xl text-void-muted mb-4">VOID</p>
            <p className="mono-label text-ash-dark">{t('empty')}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-void-border"
          >
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-void"
              >
                <JournalCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Result count */}
        {!loading && posts.length > 0 && (
          <p className="mono-label text-void-muted mt-8 text-center">
            {posts.length} transmission{posts.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>
    </div>
  )
}
