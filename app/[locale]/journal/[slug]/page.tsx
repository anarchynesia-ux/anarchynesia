import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/firestore'
import { PostDetailClient } from './PostDetailClient'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return { title: 'Transmission Not Found | ANARCHYNESIA' }

    const description = post.content.slice(0, 160).replace(/[#*`>]/g, '').trim()

    return {
      title: `${post.title} | ANARCHYNESIA`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.createdAt instanceof Date
          ? post.createdAt.toISOString()
          : new Date().toISOString(),
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
      },
    }
  } catch {
    return { title: 'ANARCHYNESIA' }
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  return <PostDetailClient slug={slug} />
}