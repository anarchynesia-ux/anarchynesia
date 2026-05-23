'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  intensity?: 'low' | 'medium' | 'high'
  alwaysOn?: boolean
}

export function GlitchText({
  text,
  className,
  as: Tag = 'span',
  intensity = 'medium',
  alwaysOn = false,
}: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false)

  const chars = '!@#$%^&*01アナキ░▒▓'

  const glitchChar = (original: string) => {
    if (!glitching && !alwaysOn) return original
    if (Math.random() > 0.85) return chars[Math.floor(Math.random() * chars.length)]
    return original
  }

  return (
    <Tag
      className={cn('relative cursor-default select-none', className)}
      onMouseEnter={() => setGlitching(true)}
      onMouseLeave={() => setGlitching(false)}
      data-text={text}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={cn(
            'inline-block transition-none',
            (glitching || alwaysOn) && Math.random() > 0.92 && 'text-blood'
          )}
        >
          {glitchChar(char)}
        </span>
      ))}

      {/* Glitch layers */}
      {(glitching || alwaysOn) && (
        <>
          <span
            className="absolute inset-0 text-blood opacity-60 pointer-events-none"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 35%)',
              transform: `translate(${intensity === 'high' ? -3 : -1}px, 0)`,
              filter: 'blur(0.5px)',
            }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-white opacity-40 pointer-events-none"
            style={{
              clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)',
              transform: `translate(${intensity === 'high' ? 3 : 1}px, 0)`,
              filter: 'blur(0.5px)',
            }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
    </Tag>
  )
}
