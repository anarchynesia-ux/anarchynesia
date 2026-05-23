import { MetadataRoute } from 'next'
import { getArchivePosts } from '@/lib/firestore'
import { Timestamp } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://anarchynesia.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const posts = await getArchivePosts()
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/journal/${post.slug}`,
      lastModified:
        post.updatedAt instanceof Timestamp
          ? post.updatedAt.toDate()
          : new Date(post.updatedAt as unknown as string),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    return [...staticRoutes, ...postRoutes]
  } catch {
    return staticRoutes
  }
}
