'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, EyeOff, Clock, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { getUserPosts, updatePost, deletePost } from '@/lib/firestore'
import { Post } from '@/types'
import { formatDate, estimateReadTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    getUserPosts(user.uid).then((p) => {
      setPosts(p)
      setLoading(false)
    })
  }, [user])

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this transmission permanently?')) return
    setDeleting(postId)
    await deletePost(postId)
    setPosts((p) => p.filter((x) => x.id !== postId))
    setDeleting(null)
  }

  const handleTogglePublish = async (post: Post) => {
    await updatePost(post.id, { draft: !post.draft })
    setPosts((p) => p.map((x) => (x.id === post.id ? { ...x, draft: !x.draft } : x)))
  }

  const filtered = posts.filter((p) => {
    if (activeTab === 'published') return !p.draft
    if (activeTab === 'drafts') return p.draft
    return true
  })

  const stats = {
    total: posts.length,
    published: posts.filter((p) => !p.draft).length,
    drafts: posts.filter((p) => p.draft).length,
  }

  if (authLoading) return null

  return (
    <div className="pt-14 min-h-dvh">
      {/* Header */}
      <div className="border-b border-void-border bg-void-soft">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User info */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.username}
                  width={52}
                  height={52}
                  className="border border-void-border"
                />
              ) : (
                <div className="w-13 h-13 border border-void-border bg-void-mid flex items-center justify-center text-ash font-display text-xl">
                  {profile?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <p className="mono-label text-ash-dark tracking-widest mb-1">
                  {t('welcome')},
                </p>
                <h1 className="font-display text-3xl text-white">
                  {profile?.username || 'ANONYMOUS'}
                </h1>
              </div>
            </motion.div>

            {/* New post button */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/publish" className="btn-blood flex items-center gap-2">
                <Plus size={14} />
                {t('newPost')}
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-3 gap-px bg-void-border mt-8 w-full max-w-sm"
          >
            {[
              { label: t('total'), value: stats.total },
              { label: t('published'), value: stats.published },
              { label: t('drafts'), value: stats.drafts },
            ].map((stat) => (
              <div key={stat.label} className="bg-void-soft p-4 text-center">
                <p className="font-display text-3xl text-white">{stat.value}</p>
                <p className="mono-label text-ash-dark mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab bar */}
        <div className="flex gap-6 border-b border-void-border mb-8">
          {(['all', 'published', 'drafts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-3 mono-label tracking-widest transition-colors border-b-2 -mb-px',
                activeTab === tab
                  ? 'text-white border-blood'
                  : 'text-ash-dark border-transparent hover:text-ash'
              )}
            >
              {tab.toUpperCase()} (
              {tab === 'all'
                ? stats.total
                : tab === 'published'
                ? stats.published
                : stats.drafts}
              )
            </button>
          ))}
        </div>

        {/* Post list */}
        {loading ? (
          <div className="space-y-px">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-void-soft loading-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-4xl text-void-border mb-4">EMPTY</p>
            <p className="mono-label text-ash-dark mb-8">{t('noPosts')}</p>
            <Link href="/publish" className="btn-blood inline-flex items-center gap-2">
              <Plus size={14} />
              {t('startWriting')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-void-border">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="py-5 flex items-start md:items-center justify-between gap-4 group hover:bg-void-soft -mx-2 px-2 transition-colors"
              >
                {/* Post info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    {post.draft ? (
                      <span className="mono-label text-ash-dark border border-void-border px-2 py-0.5 flex items-center gap-1">
                        <Clock size={9} />
                        DRAFT
                      </span>
                    ) : (
                      <span className="mono-label text-blood border border-blood/30 px-2 py-0.5 flex items-center gap-1">
                        <CheckCircle size={9} />
                        LIVE
                      </span>
                    )}
                    {post.anonymous && (
                      <span className="mono-label text-void-muted flex items-center gap-1">
                        <EyeOff size={9} />
                        anon
                      </span>
                    )}
                    <span className="mono-label text-void-muted">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="font-ui font-semibold text-ghost-bright group-hover:text-white transition-colors truncate">
                    {post.title}
                  </h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {post.tags?.slice(0, 4).map((tag) => (
                      <span key={tag} className="mono-label text-void-muted">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-1.5"
                    title={post.draft ? 'Publish' : 'Unpublish'}
                  >
                    {post.draft ? <Eye size={11} /> : <EyeOff size={11} />}
                    <span className="hidden md:inline">
                      {post.draft ? t('publish') : t('unpublish')}
                    </span>
                  </button>
                  <Link
                    href={`/publish?edit=${post.id}`}
                    className="btn-ghost py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    <Edit size={11} />
                    <span className="hidden md:inline">{t('edit')}</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="py-1.5 px-3 text-xs flex items-center gap-1.5 font-ui uppercase tracking-wide border border-void-border text-ash-dark hover:border-blood/40 hover:text-blood transition-all disabled:opacity-40"
                  >
                    <Trash2 size={11} />
                    <span className="hidden md:inline">{t('delete')}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
