import { ref, get, set, push, update, remove, query, orderByChild, equalTo, limitToLast } from 'firebase/database'
import { db } from './firebase'
import { Post, UserProfile, CreatePostInput, UpdatePostInput } from '@/types'
import slugify from 'slugify'

// ─── USERS ──────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await get(ref(db, `users/${uid}`))
  if (!snap.exists()) return null
  return { id: uid, ...snap.val() } as UserProfile
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await update(ref(db, `users/${uid}`), { ...data, updatedAt: Date.now() })
}

// ─── POSTS ──────────────────────────────────────────────────────────────────

export async function getPublishedPosts(
  pageSize = 12
): Promise<{ posts: Post[]; lastDoc: null }> {
  const q = query(ref(db, 'posts'), orderByChild('createdAt'), limitToLast(pageSize))
  const snap = await get(q)
  if (!snap.exists()) return { posts: [], lastDoc: null }

  const posts: Post[] = []
  snap.forEach((child) => {
    const val = child.val()
    if (!val.draft) posts.push({ id: child.key!, ...val } as Post)
  })

  return { posts: posts.reverse(), lastDoc: null }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(ref(db, 'posts'), orderByChild('slug'), equalTo(slug))
  const snap = await get(q)
  if (!snap.exists()) return null

  let post: Post | null = null
  snap.forEach((child) => {
    const val = child.val()
    if (!val.draft) post = { id: child.key!, ...val } as Post
  })
  return post
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const snap = await get(ref(db, 'posts'))
  if (!snap.exists()) return []

  const posts: Post[] = []
  snap.forEach((child) => {
    const val = child.val()
    if (!val.draft && val.tags?.includes(tag)) {
      posts.push({ id: child.key!, ...val } as Post)
    }
  })
  return posts.sort((a, b) => (b.createdAt as number) - (a.createdAt as number)).slice(0, 20)
}

export async function getUserPosts(authorId: string): Promise<Post[]> {
  const q = query(ref(db, 'posts'), orderByChild('authorId'), equalTo(authorId))
  const snap = await get(q)
  if (!snap.exists()) return []

  const posts: Post[] = []
  snap.forEach((child) => {
    posts.push({ id: child.key!, ...child.val() } as Post)
  })
  return posts.sort((a, b) => (b.createdAt as number) - (a.createdAt as number))
}

export async function createPost(authorId: string, data: CreatePostInput): Promise<string> {
  const slug = slugify(data.title, { lower: true, strict: true }) + '-' + Date.now().toString(36)
  const newRef = push(ref(db, 'posts'))
  await set(newRef, {
    ...data,
    slug,
    authorId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
  return newRef.key!
}

export async function updatePost(postId: string, data: UpdatePostInput): Promise<void> {
  await update(ref(db, `posts/${postId}`), { ...data, updatedAt: Date.now() })
}

export async function deletePost(postId: string): Promise<void> {
  await remove(ref(db, `posts/${postId}`))
}

export async function searchPosts(searchQuery: string): Promise<Post[]> {
  const snap = await get(ref(db, 'posts'))
  if (!snap.exists()) return []

  const all: Post[] = []
  snap.forEach((child) => {
    const val = child.val()
    if (!val.draft) all.push({ id: child.key!, ...val } as Post)
  })

  const lower = searchQuery.toLowerCase()
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.content.toLowerCase().includes(lower) ||
      p.tags?.some((t) => t.toLowerCase().includes(lower))
  )
}

export async function getArchivePosts(): Promise<Post[]> {
  const q = query(ref(db, 'posts'), orderByChild('createdAt'), limitToLast(100))
  const snap = await get(q)
  if (!snap.exists()) return []

  const posts: Post[] = []
  snap.forEach((child) => {
    const val = child.val()
    if (!val.draft) posts.push({ id: child.key!, ...val } as Post)
  })
  return posts.reverse()
}
