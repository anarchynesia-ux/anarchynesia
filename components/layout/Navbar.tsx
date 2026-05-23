'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { type Locale } from '@/i18n'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface NavbarProps {
  locale: Locale
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  const handleLocaleSwitch = () => {
    const next = locale === 'en' ? 'id' : 'en'
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/journal', label: t('journal') },
    { href: '/archive', label: t('archive') },
    { href: '/about', label: t('about') },
  ]

  const isActive = (href: string) =>
    pathname.includes(href.replace('/', `/${locale}/`))

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-void/95 backdrop-blur-sm border-b border-void-border'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl tracking-wider text-white hover:text-snow transition-colors glitch"
            data-text="ANARCHYNESIA"
          >
            ANARCHYNESIA
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'mono-label tracking-widest transition-colors hover:text-white',
                  isActive(link.href) ? 'text-white' : 'text-ash-dark'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {/* Locale switch */}
            <button
              onClick={handleLocaleSwitch}
              className="mono-label text-ash-dark hover:text-white transition-colors border border-void-border px-2 py-1 hover:border-void-muted"
            >
              {locale === 'en' ? 'ID' : 'EN'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 group"
                >
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.username}
                      width={28}
                      height={28}
                      className="rounded-none border border-void-border group-hover:border-void-muted transition-colors"
                    />
                  ) : (
                    <div className="w-7 h-7 border border-void-border bg-void-mid flex items-center justify-center">
                      <User size={12} className="text-ash" />
                    </div>
                  )}
                  <ChevronDown
                    size={10}
                    className={cn(
                      'text-ash-dark transition-transform',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-void-soft border border-void-border shadow-void"
                    >
                      <div className="p-3 border-b border-void-border">
                        <p className="font-ui text-xs text-white truncate">{profile?.username}</p>
                        <p className="mono-label text-ash-dark mt-0.5 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <DropItem href="/dashboard" label={t('dashboard')} />
                        <DropItem href="/publish" label={t('publish')} />
                        <DropItem href="/settings" label={t('settings')} />
                      </div>
                      <div className="border-t border-void-border py-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 mono-label text-ash-dark hover:text-blood-bright hover:bg-void-mid transition-colors text-left"
                        >
                          <LogOut size={10} />
                          {t('logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="btn-blood text-xs py-1.5 px-4">
                {t('login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ash hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-void md:hidden flex flex-col pt-14"
          >
            <nav className="flex flex-col p-8 gap-2 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="block font-display text-5xl text-white py-2 hover:text-blood transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <hr className="border-void-border my-4" />
              {user ? (
                <>
                  <MobileLink href="/dashboard" label={t('dashboard')} delay={0.3} />
                  <MobileLink href="/publish" label={t('publish')} delay={0.36} />
                  <MobileLink href="/settings" label={t('settings')} delay={0.42} />
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.48 }}
                    onClick={handleSignOut}
                    className="text-left mono-label text-blood hover:text-blood-bright transition-colors py-2 flex items-center gap-2"
                  >
                    <LogOut size={12} />
                    {t('logout')}
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/login" className="btn-blood inline-block">
                    {t('login')}
                  </Link>
                </motion.div>
              )}
            </nav>
            <div className="p-8 border-t border-void-border">
              <button onClick={handleLocaleSwitch} className="mono-label text-ash-dark hover:text-white transition-colors">
                Switch to {locale === 'en' ? 'Bahasa Indonesia' : 'English'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function DropItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 mono-label text-ash-dark hover:text-white hover:bg-void-mid transition-colors"
    >
      {label}
    </Link>
  )
}

function MobileLink({ href, label, delay }: { href: string; label: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <Link href={href} className="block mono-label text-ash hover:text-white transition-colors py-2">
        {label}
      </Link>
    </motion.div>
  )
}
