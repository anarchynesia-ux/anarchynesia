'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-void-border bg-void-soft mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-display text-3xl text-white mb-3">ANARCHYNESIA</p>
            <p className="mono-label text-ash-dark tracking-widest mb-4">
              DIGITAL RESISTANCE ARCHIVE
            </p>
            <p className="font-body text-ash text-sm leading-relaxed max-w-xs">
              An archive of anonymous writings, underground journals, and digital manifestos.
              No tracking. No ads. No corporate agenda.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="mono-label text-ash-dark mb-4 tracking-widest">NAVIGATE</p>
            <ul className="space-y-2">
              {[
                { href: '/journal', label: 'Journal' },
                { href: '/archive', label: 'Archive' },
                { href: '/about', label: 'Manifesto' },
                { href: '/publish', label: 'Publish' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-ui text-sm text-ash hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Philosophy */}
          <div>
            <p className="mono-label text-ash-dark mb-4 tracking-widest">PRINCIPLES</p>
            <ul className="space-y-2 font-ui text-sm text-ash">
              <li>Anonymous by design</li>
              <li>No algorithms</li>
              <li>No surveillance</li>
              <li>Open to all voices</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-void-border mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="mono-label text-void-muted">
            © {year} ANARCHYNESIA — The Underground Writes Back
          </p>
          <p className="mono-label text-void-muted">
            Built for resistance. Hosted for permanence.
          </p>
        </div>
      </div>
    </footer>
  )
}
