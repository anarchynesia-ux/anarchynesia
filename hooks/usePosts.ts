'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Post } from '@/types'
import {
  getPublishedPosts,
  getPostBySlug,
  getPostsByTag,
  searchPosts,
  getUserPosts,
  getArchivePosts,
} from '@/lib/firestore'
import type { QueryDocumentSnapshot } from 'firebase/firestore'

// Simple in-memory cache
const cache = new Map<string, { data: Post[]; ts: number }>()
const CACHE_TTL = 60_000 // 1 minute

function getCached(key: string): Post[] | null {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() - hit.ts > CACHE_TTL) { cache.delete(key); return null }
  return hit.data
}

function setCached(key: string, data: Post[]) {
  cache.set(key, { data, ts: Date.now() })
}

// ─── Hook: Feed ────────────────────────────────────────────────

export function useFeedPosts(pageSize = 12) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastDocRef = useRef<QueryDocumentSnapshot | null>(null)

  const load = useCallback(async (reset = false) => {
    const cacheKey = `feed-${pageSize}`
    if (reset) {
      const cached = getCached(cacheKey)
      if (cached) { setPosts(cached); setLoading(false); return }
    }
    setLoading(true)
    setError(null)
    try {
      const { posts: newPosts, lastDoc } = await getPublishedPosts(pageSize)
      lastDocRef.current = lastDoc
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]))
      setHasMore(newPosts.length === pageSize)
      if (reset) setCached(cacheKey, newPosts)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts.')
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  useEffect(() => { load(true) }, [load])

  return { posts, loading, hasMore, error, loadMore: () => load(false), reload: () => load(true) }
}

// ─── Hook: Single Post ─────────────────────────────────────────

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const cacheKey = `post-${slug}`
    const cached = getCached(cacheKey)
    if (cached?.[0]) { setPost(cached[0]); setLoading(false); return }

    setLoading(true)
    getPostBySlug(slug)
      .then((p) => {
        setPost(p)
        if (p) setCached(cacheKey, [p])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load post.'))
      .finally(() => setLoading(false))
  }, [slug])

  return { post, loading, error }
}

// ─── Hook: Tag Posts ───────────────────────────────────────────

export function useTagPosts(tag: string | null) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!tag) { setPosts([]); return }
    const cacheKey = `tag-${tag}`
    const cached = getCached(cacheKey)
    if (cached) { setPosts(cached); return }

    setLoading(true)
    getPostsByTag(tag)
      .then((p) => { setPosts(p); setCached(cacheKey, p) })
      .finally(() => setLoading(false))
  }, [tag])

  return { posts, loading }
}

// ─── Hook: User Posts ──────────────────────────────────────────

export function useUserPosts(uid: string | null) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    if (!uid) return
    setLoading(true)
    getUserPosts(uid)
      .then(setPosts)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load.'))
      .finally(() => setLoading(false))
  }, [uid])

  useEffect(() => { reload() }, [reload])

  return { posts, loading, error, reload, setPosts }
}

// ─── Hook: Archive Posts ───────────────────────────────────────

export function useArchivePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = getCached('archive')
    if (cached) { setPosts(cached); setLoading(false); return }
    getArchivePosts()
      .then((p) => { setPosts(p); setCached('archive', p) })
      .finally(() => setLoading(false))
  }, [])

  return { posts, loading }
}

// ─── Hook: Search ─────────────────────────────────────────────

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    try {
      const r = await searchPosts(q)
      setResults(r)
    } finally {
      setSearching(false)
    }
  }, [])

  return { query, setQuery, results, searching, search }
}