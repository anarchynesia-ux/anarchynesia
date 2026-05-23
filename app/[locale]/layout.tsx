import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n'
import '@/styles/globals.css'
import { CRTOverlay } from '@/components/ui/CRTOverlay'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { PageTransition } from '@/components/ui/PageTransition'

export const metadata: Metadata = {
  title: {
    default: 'ANARCHYNESIA — Digital Resistance Archive',
    template: '%s | ANARCHYNESIA',
  },
  description:
    'Anonymous writings, underground journals, and manifesto fragments from the digital underground. The Underground Writes Back.',
  keywords: ['anonymous writing', 'underground journal', 'digital resistance', 'manifesto', 'censorship-free'],
  authors: [{ name: 'ANARCHYNESIA' }],
  creator: 'ANARCHYNESIA',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://anarchynesia.vercel.app'),
  openGraph: {
    title: 'ANARCHYNESIA — Digital Resistance Archive',
    description: 'The Underground Writes Back.',
    type: 'website',
    siteName: 'ANARCHYNESIA',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANARCHYNESIA',
    description: 'Anonymous writings. Underground journals. The Underground Writes Back.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className="bg-void text-ghost-bright antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {/* Atmospheric overlays — fixed, non-interactive */}
            <CRTOverlay />
            <div className="noise-layer" aria-hidden="true" />

            {/* App shell */}
            <div className="relative flex flex-col min-h-dvh">
              <Navbar locale={locale as Locale} />
              <main className="flex-1">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
