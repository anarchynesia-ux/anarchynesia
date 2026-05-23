'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check, AlertCircle, User } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { updateUserProfile } from '@/lib/firestore'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const t = useTranslations('settings')
  const router = useRouter()
  const { user, profile, setProfile, loading: authLoading } = useAuthStore()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user || !username.trim()) return
    setSaving(true)
    setError(null)
    try {
      await updateUserProfile(user.uid, { username, bio })
      if (profile) setProfile({ ...profile, username, bio })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return null

  return (
    <div className="pt-14 min-h-dvh">
      {/* Header */}
      <div className="border-b border-void-border bg-void-soft">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mono-label text-blood mb-3 tracking-widest">ACCOUNT</p>
            <h1 className="font-display text-5xl md:text-7xl text-white">{t('title')}</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* Profile section */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="underground-card p-8"
        >
          <h2 className="mono-label text-ash-dark tracking-widest mb-8">{t('profile')}</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            {profile?.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.username}
                width={64}
                height={64}
                className="border border-void-border"
              />
            ) : (
              <div className="w-16 h-16 border border-void-border bg-void-mid flex items-center justify-center">
                <User size={24} className="text-ash" />
              </div>
            )}
            <div>
              <p className="font-ui text-white font-medium">{profile?.username}</p>
              <p className="mono-label text-ash-dark mt-1">
                {user?.email || 'No email'}
              </p>
              <p className="mono-label text-void-muted mt-1">
                Avatar sourced from GitHub
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-blood/10 border border-blood/30 p-3 mb-6">
              <AlertCircle size={12} className="text-blood" />
              <p className="font-mono text-xs text-blood">{error}</p>
            </div>
          )}

          {/* Username */}
          <div className="mb-6">
            <label className="mono-label text-ash-dark mb-2 block tracking-widest">
              {t('username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-underground"
              placeholder="your_username"
            />
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="mono-label text-ash-dark mb-2 block tracking-widest">
              {t('bio')}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('bioPlaceholder')}
              rows={4}
              className="input-underground resize-none"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || !username.trim()}
            className="btn-blood flex items-center gap-2 disabled:opacity-40"
          >
            {saved ? (
              <>
                <Check size={14} />
                {t('saved')}
              </>
            ) : saving ? (
              t('saving')
            ) : (
              t('save')
            )}
          </button>
        </motion.section>

        {/* Account info */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="underground-card p-8"
        >
          <h2 className="mono-label text-ash-dark tracking-widest mb-6">ACCOUNT INFO</h2>
          <div className="space-y-4">
            <InfoRow label="Provider" value="GitHub" />
            <InfoRow label="User ID" value={user?.uid?.slice(0, 16) + '...' || '—'} mono />
            <InfoRow label="Email" value={user?.email || '—'} />
            <InfoRow label="Status" value="Active" />
          </div>
        </motion.section>

        {/* Danger zone */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="border border-blood/20 p-8"
        >
          <h2 className="mono-label text-blood tracking-widest mb-4">{t('danger')}</h2>
          <p className="mono-label text-ash-dark mb-6">
            Deleting your account will permanently erase your profile. Your published transmissions will remain in the archive as anonymous.
          </p>
          <button className="border border-blood/40 text-blood mono-label px-4 py-2 hover:bg-blood/10 transition-colors">
            {t('deleteAccount')}
          </button>
        </motion.section>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-void-border last:border-0">
      <span className="mono-label text-ash-dark tracking-widest">{label}</span>
      <span className={cn('text-ash', mono ? 'font-mono text-xs' : 'font-ui text-sm')}>
        {value}
      </span>
    </div>
  )
}
