import { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  id: string
  uid: string
  username: string
  avatar: string | null
  bio: string
  email: string | null
  createdAt: Timestamp | Date
  updatedAt?: Timestamp | Date
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  language: 'en' | 'id'
  tags: string[]
  anonymous: boolean
  draft: boolean
  authorId: string
  authorName?: string
  authorAvatar?: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface CreatePostInput {
  title: string
  content: string
  language: 'en' | 'id'
  tags: string[]
  anonymous: boolean
  draft: boolean
  excerpt?: string
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  updatedAt?: Timestamp | Date
}

export type Locale = 'en' | 'id'

export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export interface SearchState {
  query: string
  tag: string | null
  language: Locale | null
  results: Post[]
  loading: boolean
}
