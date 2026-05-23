'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TagChipProps {
  tag: string
  active?: boolean
  onClick?: () => void
  href?: string
  size?: 'sm' | 'md'
}

export function TagChip({ tag, active, onClick, href, size = 'md' }: TagChipProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) { onClick(); return }
    if (href) { router.push(href); return }
    router.push(`/journal?tag=${encodeURIComponent(tag)}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'tag-chip transition-all',
        size === 'sm' && 'text-[0.6rem] px-2 py-1',
        active && 'active'
      )}
    >
      #{tag}
    </button>
  )
}

interface TagListProps {
  tags: string[]
  activeTag?: string | null
  onTagClick?: (tag: string) => void
  limit?: number
  size?: 'sm' | 'md'
}

export function TagList({ tags, activeTag, onTagClick, limit, size }: TagListProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          active={activeTag === tag}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
          size={size}
        />
      ))}
      {limit && tags.length > limit && (
        <span className="tag-chip opacity-40 cursor-default">
          +{tags.length - limit}
        </span>
      )}
    </div>
  )
}
