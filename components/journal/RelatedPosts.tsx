'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Post } from '@/types'
import { getPostsByTag } from '@/lib/firestore'
import { formatDate, truncate, stripMarkdown } from '@/lib/utils'

interface RelatedPostsProps {
  currentPostId: string
  tags: string[]
}

export function RelatedPosts({ currentPostId, tags }: RelatedPostsProps) {
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tags?.length) { setLoading(false); return }

    // Fetch from first tag, filter out current post
    getPostsByTag(tags[0])
      .then((posts) => {
        const filtered = posts
          .filter((p) => p.id !== currentPostId)
          .slice(0, 3)
        setRelated(filtered)
      })
      .finally(() => setLoading(false))
  }, [currentPostId, tags])

  if (loading || related.length === 0) return null

  return (
    <section className="border-t border-void-border mt-16 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-px bg-blood" />
        <p className="mono-label text-ash-dark tracking-widest">MORE TRANSMISSIONS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-void-border">
        {related.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-void"
          >
            <Link
              href={`/journal/${post.slug}`}
              className="group block underground-card p-5 h-full"
            >
              <p className="mono-label text-void-muted mb-2">{formatDate(post.createdAt)}</p>
              <h3 className="font-display text-xl text-white group-hover:text-snow transition-colors leading-tight mb-2">
                {post.title}
              </h3>
              <p className="font-body text-ash text-xs leading-relaxed mb-4">
                {truncate(stripMarkdown(post.content), 80)}
              </p>
              <div className="flex items-center gap-1 mono-label text-blood opacity-0 group-hover:opacity-100 transition-opacity">
                read <ArrowRight size={9} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
