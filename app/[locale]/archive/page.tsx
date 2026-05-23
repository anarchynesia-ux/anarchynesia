'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getArchivePosts } from '@/lib/firestore'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { Timestamp } from 'firebase/firestore'
import { cn } from '@/lib/utils'
import { ArrowRight, EyeOff } from 'lucide-react'

type ViewMode = 'year' | 'tag'

export default function ArchivePage() {
  const t = useTranslations('archive')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('year')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    getArchivePosts().then((p) => {
      setPosts(p)
      setLoading(false)
    })
  }, [])

  // Group by year
  const byYear = useMemo(() => {
    const map = new Map<number, Post[]>()
    posts.forEach((p) => {
      const d = p.createdAt instanceof Timestamp ? p.createdAt.toDate() : new Date(p.createdAt as string)
      const y = d.getFullYear()
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(p)
    })
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
  }, [posts])

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  // Posts filtered by tag
  const tagFiltered = useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter((p) => p.tags?.includes(selectedTag))
  }, [posts, selectedTag])

  return (
    <div className="pt-14 min-h-dvh">
      {/* Header */}
      <div className="border-b border-void-border bg-void-soft">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mono-label text-blood mb-3 tracking-widest">PERMANENT RECORD</p>
            <h1 className="font-display text-6xl md:text-8xl text-white leading-[0.9] mb-4">
              {t('title')}
            </h1>
            <p className="font-body text-ash">{t('subtitle')}</p>
          </motion.div>

          {/* View toggle */}
          <div className="flex gap-2 mt-8">
            <button
              onClick={() => setViewMode('year')}
              className={cn(
                'mono-label px-4 py-2 border transition-colors',
                viewMode === 'year'
                  ? 'border-blood bg-blood/10 text-white'
                  : 'border-void-border text-ash-dark hover:text-ash'
              )}
            >
              {t('byYear')}
            </button>
            <button
              onClick={() => setViewMode('tag')}
              className={cn(
                'mono-label px-4 py-2 border transition-colors',
                viewMode === 'tag'
                  ? 'border-blood bg-blood/10 text-white'
                  : 'border-void-border text-ash-dark hover:text-ash'
              )}
            >
              {t('byTag')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-void-soft loading-pulse" />
            ))}
          </div>
        ) : viewMode === 'year' ? (
          <div className="space-y-16">
            {byYear.map(([year, yearPosts], yi) => (
              <motion.section
                key={year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: yi * 0.1, duration: 0.7 }}
              >
                {/* Year heading */}
                <div className="flex items-center gap-6 mb-8">
                  <span className="font-display text-7xl text-void-border leading-none shrink-0">
                    {year}
                  </span>
                  <div className="h-px flex-1 bg-void-border" />
                  <span className="mono-label text-void-muted shrink-0">
                    {yearPosts.length} transmissions
                  </span>
                </div>

                {/* Post list */}
                <div className="divide-y divide-void-border ml-0 md:ml-8">
                  {yearPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ArchiveListItem post={post} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        ) : (
          // Tag view
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            {/* Tag list */}
            <div>
              <p className="mono-label text-ash-dark mb-4 tracking-widest">TAGS</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={cn(
                    'text-left tag-chip py-2',
                    selectedTag === null && 'active'
                  )}
                >
                  All ({posts.length})
                </button>
                {allTags.map((tag) => {
                  const count = posts.filter((p) => p.tags?.includes(tag)).length
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={cn('text-left tag-chip py-2', selectedTag === tag && 'active')}
                    >
                      #{tag} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filtered posts */}
            <div className="divide-y divide-void-border">
              {tagFiltered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ArchiveListItem post={post} />
                </motion.div>
              ))}
              {tagFiltered.length === 0 && (
                <p className="mono-label text-void-muted py-8">No transmissions with this tag.</p>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-32">
            <p className="font-display text-5xl text-void-border mb-4">EMPTY ARCHIVE</p>
            <p className="mono-label text-ash-dark mb-8">No transmissions have been recorded yet.</p>
            <Link href="/publish" className="btn-blood">Begin the Archive</Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ArchiveListItem({ post }: { post: Post }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group flex items-start md:items-center justify-between gap-4 py-4 hover:bg-void-soft transition-colors px-2 -mx-2"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          {post.anonymous && (
            <span className="flex items-center gap-1 mono-label text-blood">
              <EyeOff size={9} />
              anon
            </span>
          )}
          {post.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="mono-label text-void-muted">#{tag}</span>
          ))}
        </div>
        <h3 className="font-ui font-semibold text-ghost-bright group-hover:text-white transition-colors truncate">
          {post.title}
        </h3>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="mono-label text-void-muted hidden md:block whitespace-nowrap">
          {formatDate(post.createdAt)}
        </span>
        <ArrowRight size={12} className="text-void-muted group-hover:text-blood transition-colors" />
      </div>
    </Link>
  )
}
