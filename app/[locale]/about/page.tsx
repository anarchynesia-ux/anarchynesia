'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const MANIFESTO = [
  {
    n: '01',
    title: 'The Right to Anonymity',
    body: `In an age of surveillance capitalism, the anonymous voice is the last free voice. We do not ask who you are. We ask what you think. The message matters. The messenger is optional.`,
  },
  {
    n: '02',
    title: 'Against the Algorithm',
    body: `No feed ranking. No engagement optimization. No shadow banning. Words are presented in the order they are written — chronological, permanent, neutral. The archive does not curate. It preserves.`,
  },
  {
    n: '03',
    title: 'The Digital Underground',
    body: `Corporate platforms are billboards. Anarchynesia is a wall. A wall that no advertiser can rent, no algorithm can tame, no corporation can buy. Here, the underground speaks in its own voice.`,
  },
  {
    n: '04',
    title: 'Permanence as Resistance',
    body: `Every word submitted becomes part of the permanent archive. We do not delete on demand. We do not comply with censorship orders. The record persists because erasure is the enemy of truth.`,
  },
  {
    n: '05',
    title: 'Writing as a Political Act',
    body: `Every manifesto begins with a sentence. Every revolution begins with a word. To write is to claim space, to document existence, to resist the forgetting that power depends on. We write therefore we resist.`,
  },
  {
    n: '06',
    title: 'Open to All Voices',
    body: `Not left. Not right. Not any single ideology. Anarchynesia is a channel, not a megaphone. If you have something worth saying — a fragment, a manifesto, an observation, a poem — the archive is yours.`,
  },
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const lineH = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div className="pt-14 min-h-dvh" ref={containerRef}>
      {/* Hero */}
      <section className="relative py-32 px-6 border-b border-void-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(139,0,0,0.07)_0%,transparent_60%)]" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mono-label text-blood mb-6 tracking-widest">THE MANIFESTO</p>
            <h1 className="font-display text-[clamp(4rem,12vw,9rem)] text-white leading-[0.88] mb-8">
              Why We<br />Write From<br />The Shadows
            </h1>
            <div className="flex items-center gap-6 max-w-2xl">
              <div className="w-1 h-20 bg-blood shrink-0" />
              <p className="font-body text-ash text-lg md:text-xl leading-relaxed italic">
                &ldquo;Anarchynesia is not a platform. It is a practice. A discipline of anonymous truth-telling in a world that punishes the unmasked.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manifesto content */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[60px_1fr] gap-0">
          {/* Progress line */}
          <div className="hidden lg:block relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-void-border">
              <motion.div
                className="absolute top-0 left-0 w-full bg-blood origin-top"
                style={{ height: lineH }}
              />
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-0 divide-y divide-void-border">
            {MANIFESTO.map((item, i) => (
              <motion.article
                key={item.n}
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="py-12 lg:pl-12"
              >
                <div className="flex items-start gap-6 mb-4">
                  <span className="font-mono text-blood text-xs mt-1 shrink-0">{item.n}</span>
                  <h2 className="font-display text-3xl md:text-4xl text-white">{item.title}</h2>
                </div>
                <p className="font-body text-ash text-lg leading-relaxed lg:pl-10 max-w-3xl">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-void-border py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-display text-5xl md:text-7xl text-white mb-8 leading-[0.9]">
            Ready to<br />Transmit?
          </p>
          <p className="font-body text-ash text-lg mb-10">
            Join the archive. Publish anonymously. Leave a permanent mark.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/publish" className="btn-blood inline-flex items-center gap-2 group justify-center">
              Begin Writing
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/journal" className="btn-ghost justify-center">
              Read the Archive
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
