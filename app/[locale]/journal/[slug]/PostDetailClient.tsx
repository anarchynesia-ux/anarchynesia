'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, EyeOff, Clock, Tag } from 'lucide-react'
import { getPostBySlug } from '@/lib/firestore'
import { Post } from '@/types'
import { formatDate, estimateReadTime } from '@/lib/utils'
import { RelatedPosts } from '@/components/journal/RelatedPosts'
import { PostActions } from '@/components/journal/PostActions'
import { TagList } from '@/components/ui/TagChip'
import { PostSkeleton } from '@/components/ui/LoadingScreen'

interface PostDetailClientProps {
  slug: string
}

export function PostDetailClient({ slug }: PostDetailClientProps) {
  const t = useTranslations('post')
  const router = useRouter()
  const articleRef = useRef<HTMLDivElement>(null)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setScrollProgress(Math.min(v, 1)))
  }, [scrollYProgress])

  useEffect(() => {
    getPostBySlug(slug).then((p) => {
      setPost(p)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="pt-14 min-h-dvh px-6 py-12 max-w-6xl mx-auto">
        <div className="h-6 w-24 bg-void-border mb-12 loading-pulse" />
        <div className="h-16 w-3/4 bg-void-border mb-6 loading-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[0, 1, 2].map((i) => <PostSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-14 min-h-dvh flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-display text-8xl text-void-border mb-4">404</p>
          <p className="mono-label text-ash-dark mb-8">Transmission not found in archive.</p>
          <button onClick={() => router.push('/journal')} className="btn-ghost">
            {t('backToFeed')}
          </button>
        </div>
      </div>
    )
  }

  const readTime = estimateReadTime(post.content)

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-void-border">
        <motion.div
          className="h-full bg-blood origin-left"
          style={{ scaleX: scrollProgress }}
        />
      </div>

      <div className="pt-14 min-h-dvh" ref={articleRef}>
        {/* ── Hero ─────────────────────────────────────── */}
        <div className="border-b border-void-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(139,0,0,0.06)_0%,transparent_70%)]" />

          <div className="max-w-5xl mx-auto px-6 pt-14 pb-10 relative">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 mono-label text-ash-dark hover:text-white transition-colors mb-10 group"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              {t('backToFeed')}
            </motion.button>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-5"
              >
                <TagList tags={post.tags} size="sm" />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.88] mb-8"
            >
              {post.title}
            </motion.h1>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 md:gap-6"
            >
              {post.anonymous ? (
                <div className="flex items-center gap-1.5 mono-label text-blood">
                  <EyeOff size={10} />
                  {t('anonymous')}
                </div>
              ) : (
                post.authorName && (
                  <span className="mono-label text-ash-dark">
                    {t('by')} {post.authorName}
                  </span>
                )
              )}

              <div className="flex items-center gap-1.5 mono-label text-ash-dark">
                <Clock size={10} />
                {readTime} min read
              </div>

              <span className="mono-label text-ash-dark">
                {t('publishedOn')} {formatDate(post.createdAt)}
              </span>

              <span className="mono-label text-void-muted border border-void-border px-2 py-0.5 uppercase">
                {post.language}
              </span>

              {/* Share actions */}
              <div className="ml-auto hidden md:block">
                <PostActions title={post.title} slug={post.slug} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 lg:gap-16">
          {/* Article body */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="prose-underground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Mobile share */}
            <div className="mt-10 md:hidden">
              <PostActions title={post.title} slug={post.slug} />
            </div>

            {/* End decoration */}
            <div className="flex items-center gap-4 mt-16 mb-10">
              <div className="h-px flex-1 bg-void-border" />
              <span className="font-display text-void-muted text-sm tracking-[0.3em]">— END OF TRANSMISSION —</span>
              <div className="h-px flex-1 bg-void-border" />
            </div>

            <button
              onClick={() => router.push('/journal')}
              className="btn-ghost inline-flex items-center gap-2 group"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              {t('backToFeed')}
            </button>

            {/* Related posts */}
            {post.tags?.length > 0 && (
              <RelatedPosts currentPostId={post.id} tags={post.tags} />
            )}
          </motion.div>

          {/* ── Sidebar ──────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="sticky top-20 space-y-8">
              {/* Share */}
              <div>
                <p className="mono-label text-ash-dark mb-3 tracking-widest">{t('share')}</p>
                <PostActions title={post.title} slug={post.slug} className="flex-col items-start" />
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div>
                  <p className="mono-label text-ash-dark mb-3 tracking-widest flex items-center gap-1.5">
                    <Tag size={10} />
                    {t('tags')}
                  </p>
                  <TagList tags={post.tags} size="sm" />
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-void-border pt-6 space-y-4">
                <MetaItem label="TRANSMITTED" value={formatDate(post.createdAt)} />
                <MetaItem label="READ TIME" value={`${readTime} minutes`} />
                <MetaItem label="FORMAT" value="Markdown" />
                <MetaItem label="LANGUAGE" value={post.language.toUpperCase()} />
                {post.anonymous && (
                  <MetaItem label="IDENTITY" value="Anonymous" valueClass="text-blood" />
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </>
  )
}

function MetaItem({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div>
      <p className="mono-label text-void-muted mb-0.5">{label}</p>
      <p className={`mono-label text-ash-dark ${valueClass || ''}`}>{value}</p>
    </div>
  )
}
