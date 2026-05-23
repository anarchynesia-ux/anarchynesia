import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Timestamp } from 'firebase/firestore'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Timestamp | Date | string | null | undefined): string {
  if (!date) return '—'
  try {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date as string)
    return format(d, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export function formatRelative(date: Timestamp | Date | string | null | undefined): string {
  if (!date) return '—'
  try {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date as string)
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return '—'
  }
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '…'
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^\s*[-*>]\s/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
