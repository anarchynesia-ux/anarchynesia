'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Post } from '@/types'
import { formatDate, estimateReadTime, truncate, stripMarkdown } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface JournalCardProps {
  post: Post
  featured?: boolean
}

export function JournalCard({ post, featured = false }: JournalCardProps) {
  const excerpt = post.excerpt || truncate(stripMarkdown(post.content), 140)
  const readTime = estimateReadTime(post.content)

  return (
    <Link href={`/journal/${post.slug}`} className="block h-full group">
      <article
        className={cn(
          'underground-card h-full flex flex-col',
          featured ? 'p-8 min-h-[260px]' : 'p-6 min-h-[200px]'
        )}
      >
        {/* Top meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="mono-label text-void-muted">{formatDate(post.createdAt)}</span>
            {post.anonymous ? (
              <span className="flex items-center gap-1 mono-label text-blood">
                <EyeOff size={9} />
                anon
              </span>
            ) : (
              post.authorName && (
                <span className="mono-label text-ash-dark">{post.authorName}</span>
              )
            )}
          </div>
          <span className="mono-label text-void-muted">{readTime}m read</span>
        </div>

        {/* Title */}
        <h2
          className={cn(
            'font-display text-white group-hover:text-snow transition-colors leading-tight mb-3',
            featured ? 'text-3xl md:text-4xl' : 'text-2xl'
          )}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="font-body text-ash text-sm leading-relaxed flex-1 mb-4">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-void-border">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap min-w-0">
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1.5 mono-label text-ash-dark group-hover:text-blood-light transition-colors shrink-0 ml-2">
            read
            <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Hover blood accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-blood scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </article>
    </Link>
  )
}
