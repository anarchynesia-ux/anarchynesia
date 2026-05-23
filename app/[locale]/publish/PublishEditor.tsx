'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Save, Send, Eye, Edit3, EyeOff, Eye as EyeOn,
  Globe, Tag, X, Check, AlertCircle, ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { createPost, updatePost } from '@/lib/firestore'
import { ref, get } from 'firebase/database'
import { db } from '@/lib/firebase'
import { Post } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/lib/utils'

type EditorMode = 'write' | 'preview'

interface DraftState {
  title: string
  content: string
  tags: string
  language: 'en' | 'id'
  anonymous: boolean
}

const EMPTY_DRAFT: DraftState = {
  title: '',
  content: '',
  tags: '',
  language: 'en',
  anonymous: false,
}

export function PublishEditor() {
  const t = useTranslations('editor')
  const router = useRouter()
  const params = useSearchParams()
  const editId = params.get('edit')
  const { user, loading: authLoading } = useAuthStore()

  const [draft, setDraft] = useLocalStorage<DraftState>('anarchynesia-draft', EMPTY_DRAFT)
  const [title, setTitle] = useState(editId ? '' : draft.title)
  const [content, setContent] = useState(editId ? '' : draft.content)
  const [tags, setTags] = useState(editId ? '' : draft.tags)
  const [language, setLanguage] = useState<'en' | 'id'>(editId ? 'en' : draft.language)
  const [anonymous, setAnonymous] = useState(editId ? false : draft.anonymous)
  const [mode, setMode] = useState<EditorMode>('write')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [editPostId, setEditPostId] = useState<string | null>(null)
  const [loadingPost, setLoadingPost] = useState(!!editId)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autosaveRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  // Load existing post for edit — uses Realtime Database
  useEffect(() => {
    if (!editId) return
    const load = async () => {
      try {
        const snap = await get(ref(db, `posts/${editId}`))
        if (!snap.exists()) { setLoadingPost(false); return }
        const p = { id: editId, ...snap.val() } as Post
        setTitle(p.title)
        setContent(p.content)
        setTags(p.tags?.join(', ') || '')
        setLanguage(p.language || 'en')
        setAnonymous(p.anonymous || false)
        setEditPostId(editId)
      } finally {
        setLoadingPost(false)
      }
    }
    load()
  }, [editId])

  useEffect(() => {
    if (editId) return
    clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => {
      if (title || content) {
        setSaveStatus('saving')
        setDraft({ title, content, tags, language, anonymous })
        setTimeout(() => setSaveStatus('saved'), 300)
        setTimeout(() => setSaveStatus('idle'), 2500)
      }
    }, 2000)
    return () => clearTimeout(autosaveRef.current)
  }, [title, content, tags, language, anonymous, editId, setDraft])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const next = content.substring(0, start) + '  ' + content.substring(end)
      setContent(next)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSaveDraft()
    }
  }

  const parsedTags = tags
    .split(',')
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean)

  const handleSaveDraft = useCallback(async () => {
    if (!user || !title.trim()) return
    setSaving(true)
    setError(null)
    try {
      const data = { title, content, tags: parsedTags, language, anonymous, draft: true }
      if (editPostId) {
        await updatePost(editPostId, data)
      } else {
        const id = await createPost(user.uid, data)
        setEditPostId(id)
        if (!editId) setDraft(EMPTY_DRAFT)
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft.')
    } finally {
      setSaving(false)
    }
  }, [user, title, content, parsedTags, language, anonymous, editPostId, editId, setDraft])

  const handlePublish = useCallback(async () => {
    if (!user || !title.trim() || !content.trim()) {
      setError('Title and content are required to publish.')
      return
    }
    setPublishing(true)
    setError(null)
    try {
      const data = { title, content, tags: parsedTags, language, anonymous, draft: false }
      if (editPostId) {
        await updatePost(editPostId, data)
      } else {
        await createPost(user.uid, data)
      }
      if (!editId) setDraft(EMPTY_DRAFT)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish.')
      setPublishing(false)
    }
  }, [user, title, content, parsedTags, language, anonymous, editPostId, editId, setDraft, router])

  if (authLoading || loadingPost) {
    return (
      <div className="pt-14 min-h-dvh flex items-center justify-center">
        <p className="mono-label text-void-muted animate-pulse">Initialising editor...</p>
      </div>
    )
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div className="pt-14 min-h-dvh flex flex-col">
      <div className="border-b border-void-border bg-void/95 backdrop-blur-sm sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="text-void-muted hover:text-ash transition-colors hidden md:block">
              <ArrowLeft size={14} />
            </button>
            <div className="flex items-center border border-void-border">
              {(['write', 'preview'] as EditorMode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={cn('flex items-center gap-1.5 px-3 py-1.5 mono-label transition-colors capitalize', mode === m ? 'bg-void-mid text-white' : 'text-ash-dark hover:text-ash')}>
                  {m === 'write' ? <Edit3 size={9} /> : <Eye size={9} />}
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {saveStatus === 'saved' && (
                <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-1 mono-label text-blood">
                  <Check size={9} />saved
                </motion.span>
              )}
              {saveStatus === 'saving' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mono-label text-void-muted animate-pulse">saving...</motion.span>
              )}
            </AnimatePresence>
            <span className="mono-label text-void-muted hidden md:inline">{wordCount} words · {charCount} chars</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveDraft} disabled={saving || !title.trim()} className="btn-ghost py-1 px-3 text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
              <Save size={11} />
              <span className="hidden sm:inline">{saving ? 'Saving...' : t('saveDraft')}</span>
            </button>
            <button onClick={handlePublish} disabled={publishing || !title.trim() || !content.trim()} className="btn-blood py-1 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
              <Send size={11} />
              {publishing ? 'Publishing...' : t('publish')}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-blood/10 border-b border-blood/30 px-6 py-3 flex items-center gap-2">
            <AlertCircle size={12} className="text-blood shrink-0" />
            <p className="font-mono text-xs text-blood flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-blood hover:text-blood-bright ml-2"><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        <div className="min-w-0">
          <textarea value={title} onChange={(e) => { setTitle(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }} placeholder={t('titlePlaceholder')} className="w-full bg-transparent border-none font-display text-4xl md:text-6xl text-white placeholder-void-border focus:outline-none mb-4 leading-tight resize-none overflow-hidden" rows={1} />
          <div className="h-px bg-void-border mb-6" />
          <AnimatePresence mode="wait">
            {mode === 'write' ? (
              <motion.div key="write" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={handleKeyDown} placeholder={t('contentPlaceholder')} className="editor-area min-h-[55vh] w-full" />
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="prose-underground min-h-[55vh]">
                {title && <h1 className="font-display text-4xl text-white mb-6 leading-tight">{title}</h1>}
                {content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <p className="text-void-muted font-mono text-sm italic">Nothing to preview yet...</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-6 lg:border-l lg:border-void-border lg:pl-6">
          <div>
            <label className="mono-label text-ash-dark mb-2 flex items-center gap-1.5 tracking-widest"><Tag size={10} />{t('tags')}</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('tagsPlaceholder')} className="input-underground text-sm py-2" />
            {parsedTags.length > 0 && <div className="flex gap-2 flex-wrap mt-2">{parsedTags.map((tag) => <span key={tag} className="tag-chip">#{tag}</span>)}</div>}
          </div>
          <div>
            <label className="mono-label text-ash-dark mb-2 flex items-center gap-1.5 tracking-widest"><Globe size={10} />{t('language')}</label>
            <div className="flex gap-2">
              {(['en', 'id'] as const).map((lang) => (
                <button key={lang} onClick={() => setLanguage(lang)} className={cn('flex-1 py-2 mono-label transition-all border', language === lang ? 'border-blood bg-blood/10 text-white' : 'border-void-border text-ash-dark hover:text-ash hover:border-void-muted')}>{lang.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mono-label text-ash-dark mb-2 flex items-center gap-1.5 tracking-widest">{anonymous ? <EyeOff size={10} className="text-blood" /> : <EyeOn size={10} />}{t('anonymous')}</label>
            <button onClick={() => setAnonymous(!anonymous)} className={cn('w-full py-3 border mono-label tracking-widest transition-all', anonymous ? 'border-blood/40 bg-blood/10 text-blood' : 'border-void-border text-ash-dark hover:border-void-muted hover:text-ash')}>
              {anonymous ? '● ANONYMOUS ON' : '○ ANONYMOUS OFF'}
            </button>
            <p className="mono-label text-void-muted mt-2 leading-relaxed text-[0.62rem]">{t('anonymousHelp')}</p>
          </div>
          <div className="border-t border-void-border pt-4">
            <p className="mono-label text-ash-dark mb-3 tracking-widest">SHORTCUTS</p>
            <div className="space-y-1.5">
              {[['⌘ S', 'Save draft'], ['Tab', 'Indent']].map(([key, label]) => (
                <div key={key} className="flex justify-between">
                  <code className="font-mono text-[10px] text-ash border border-void-border px-1.5 py-0.5">{key}</code>
                  <span className="mono-label text-void-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
