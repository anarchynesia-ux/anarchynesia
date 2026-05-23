'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Minus } from 'lucide-react'
import { getPublishedPosts } from '@/lib/firestore'
import { Post } from '@/types'
import { JournalCard } from '@/components/journal/JournalCard'
import { formatDate } from '@/lib/utils'

const QUOTES = [
  'The medium is the message. The underground is the movement.',
  'Every word published without a face is a small act of resistance.',
  'We write because silence is complicity.',
  'Truth wears no byline. Resistance needs no address.',
]

export default function HomePage() {
  const t = useTranslations()
  const heroRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [quoteIdx, setQuoteIdx] = useState(0)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    getPublishedPosts(6).then(({ posts }) => setPosts(posts))
    const interval = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background atmospheric gradient */}
        <div className="absolute inset-0 bg-void">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(139,0,0,0.06)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(139,0,0,0.04)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-void to-transparent" />
        </div>

        {/* Vertical decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-void-border to-transparent opacity-40" />
          <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-void-border to-transparent opacity-40" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Tagline pill */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <span className="mono-label border border-void-border px-4 py-1.5 text-ash-dark tracking-widest">
                {t('home.hero.tagline')}
              </span>
            </motion.div>

            {/* Main title */}
            <motion.div variants={itemVariants}>
              <h1
                className="font-display text-[clamp(4rem,14vw,11rem)] text-white leading-[0.88] tracking-[-0.01em] glitch select-none"
                data-text="ANARCHYNESIA"
              >
                ANARCHYNESIA
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-blood" />
                <p className="font-ui font-light text-sm md:text-base tracking-[0.3em] uppercase text-ash">
                  {t('home.hero.subtitle')}
                </p>
                <div className="h-px w-12 bg-blood" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="font-body text-ash text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            >
              {t('home.hero.description')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/journal" className="btn-blood group flex items-center gap-2 justify-center">
                {t('home.hero.cta')}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="btn-ghost">
                {t('home.hero.secondary')}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="mono-label text-void-muted tracking-[0.3em]">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-void-border to-transparent" />
        </motion.div>
      </section>

      {/* ── Rotating Quote ───────────────────────────── */}
      <section className="border-y border-void-border bg-void-soft py-8 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p
            key={quoteIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="font-body italic text-ash text-base md:text-lg"
          >
            &ldquo;{QUOTES[quoteIdx]}&rdquo;
          </motion.p>
        </div>
      </section>

      {/* ── Featured Transmissions ────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="blood-accent">
              <p className="mono-label text-ash-dark mb-3 tracking-widest">TRANSMISSIONS</p>
              <h2 className="font-display text-4xl md:text-6xl text-white">
                {t('home.featured')}
              </h2>
            </div>
          </motion.div>

          {posts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-void-border">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-void-soft h-72 loading-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-void-border">
              {posts.slice(0, 3).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <JournalCard post={post} featured />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Archive ──────────────────────── */}
      {posts.length > 3 && (
        <section className="py-24 px-6 border-t border-void-border">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-end justify-between mb-16"
            >
              <div className="blood-accent">
                <p className="mono-label text-ash-dark mb-3 tracking-widest">ARCHIVE</p>
                <h2 className="font-display text-4xl md:text-6xl text-white">
                  {t('home.latest')}
                </h2>
              </div>
              <Link
                href="/journal"
                className="hidden md:flex items-center gap-2 mono-label text-ash-dark hover:text-ash transition-colors group"
              >
                View all
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="divide-y divide-void-border">
              {posts.slice(3).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <ArchiveRow post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Manifesto Teaser ──────────────────────── */}
      <section className="py-32 px-6 border-t border-void-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.05)_0%,transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <p className="mono-label text-blood mb-6 tracking-widest">THE UNDERGROUND</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-8 leading-[0.9]">
            The Underground<br />Writes Back
          </h2>
          <p className="font-body text-ash text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Anarchynesia is not a blog. It is a transmission channel. A permanent record.
            A place where anonymous voices leave marks that corporations cannot erase
            and algorithms cannot silence.
          </p>
          <Link href="/about" className="btn-blood inline-flex items-center gap-2 group">
            Read the Manifesto
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </>
  )
}

function ArchiveRow({ post }: { post: Post }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group flex items-start md:items-center justify-between gap-4 py-5 hover:bg-void-soft transition-colors px-2 -mx-2"
    >
      <div className="flex items-start md:items-center gap-4 min-w-0">
        <Minus size={12} className="text-blood mt-1 md:mt-0 shrink-0" />
        <div className="min-w-0">
          <h3 className="font-ui font-semibold text-ghost-bright group-hover:text-white transition-colors truncate">
            {post.title}
          </h3>
          {post.tags?.length > 0 && (
            <div className="flex gap-2 mt-1 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="mono-label">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-4">
        {post.anonymous && (
          <span className="mono-label text-void-muted hidden md:block">anon</span>
        )}
        <span className="mono-label text-void-muted whitespace-nowrap">
          {formatDate(post.createdAt)}
        </span>
        <ArrowRight size={12} className="text-void-muted group-hover:text-blood transition-colors" />
      </div>
    </Link>
  )
}
