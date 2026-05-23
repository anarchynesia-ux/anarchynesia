/**
 * ANARCHYNESIA — Firestore Seed Script
 * Usage: npx ts-node --esm scripts/seed.ts
 * Or via Firebase Admin SDK in Node.js environment
 *
 * NOTE: Run this ONCE to populate demo data.
 * Requires FIREBASE_SERVICE_ACCOUNT env or direct admin SDK setup.
 */

export const SEED_POSTS = [
  {
    title: 'On the Death of Public Space',
    content: `The commons have been enclosed. The digital square is now a shopping mall with surveillance cameras on every corner and a terms of service where your attention is the rent.

## The Enclosure Movement, Repeated

History moves in spirals. The English commons were enclosed in the 16th century, forcing peasants off shared land into wage labor. The internet commons were enclosed in the 2010s, forcing discourse into engagement-optimized boxes.

The playbook is the same: offer access, accumulate dependency, extract rent.

> What appears as public space is privately owned, algorithmically curated, and economically incentivized toward engagement over enlightenment.

## The Archive as Counter-enclosure

Writing here is an act of re-enclosure in reverse. A small parcel of digital commons, held in common, governed by no advertiser, optimized for no algorithm but the slow accumulation of honest thought.

Every transmission added to this archive is a brick in the wall we are building against the enclosure.

---

The commons can be reclaimed. Not through legislation. Through practice.

Write. Publish. Persist.`,
    tags: ['resistance', 'digital', 'manifesto'],
    language: 'en',
    anonymous: true,
    draft: false,
  },
  {
    title: 'A Manifesto for Slow Media',
    content: `Speed is not a virtue. The acceleration of information is the deceleration of thought. We need to slow down.

## Against the Refresh

We have built a world where the newest thing is always the most important thing. Where recency is mistaken for relevance. Where a post from three years ago is ancient history and a post from three minutes ago is breaking news.

This is an epistemological disaster.

## The Case for Permanence

A good argument does not expire. A careful observation does not become false because it is old. The best things ever written were written before the internet existed, and they remain the best things ever written.

> Slow media is not about being late. It is about being right.

## What We Lose at Speed

- The ability to sit with complexity
- The willingness to update our beliefs
- The capacity for sustained attention
- The pleasure of being genuinely surprised

## What We Gain by Slowing Down

Everything worth having.

---

Write slowly. Publish when it's ready. Let it remain.`,
    tags: ['manifesto', 'culture', 'media'],
    language: 'en',
    anonymous: false,
    draft: false,
  },
  {
    title: 'Notes from an Underground Algorithm',
    content: `They say neutrality. They mean invisibility. The machine has preferences and they are not yours.

## The Myth of the Neutral Feed

Every feed is a curation. Every curation is a politics. The feed that claims to show you "what's relevant" is making thousands of small political decisions per second — who gets seen, who gets buried, what counts as engagement, what counts as harm.

These decisions are not made by a neutral arbiter. They are made by code, written by humans, optimized for shareholder value.

## What the Algorithm Wants

The algorithm wants engagement. Engagement is not agreement. Engagement is not understanding. Engagement is not even interest. Engagement is the act of responding — clicking, sharing, reacting, replying.

Fear gets engagement. Anger gets engagement. Outrage gets engagement.

Nuance does not get engagement.

> The machine has learned that the shortest path to your click is through your nervous system.

## Writing Outside the Machine

To write here is to write outside the machine. There is no feed to optimize for. There is no engagement metric to chase. There are only words, and the people who find them.

This is the underground. The algorithm does not work here.`,
    tags: ['technology', 'algorithm', 'resistance'],
    language: 'en',
    anonymous: true,
    draft: false,
  },
  {
    title: 'Tentang Menulis Tanpa Nama',
    content: `Nama adalah sebuah konstruksi. Identitas adalah sebuah penjara. Anonim bukan berarti tidak ada — anonim berarti bebas.

## Sejarah Suara Tanpa Nama

Sepanjang sejarah, tulisan-tulisan paling berbahaya dan paling jujur diterbitkan tanpa nama. Bukan karena penulisnya pengecut — justru sebaliknya. Karena mereka cukup berani untuk menempatkan ide di atas identitas.

Federalist Papers ditulis secara anonim. Banyak pamflet revolusi diterbitkan tanpa nama. Bahkan beberapa buku paling berpengaruh dalam sejarah pertama kali muncul tanpa nama pengarang.

## Mengapa Anonimitas Penting

Di era pengawasan digital, nama bukan sekadar identitas. Nama adalah vektor serangan. Nama terhubung ke pekerjaan, keluarga, reputasi. Nama bisa dihukum.

> Ketika kamu menulis tanpa nama, yang tersisa adalah idenya. Murni. Tidak terkontaminasi oleh prasangka terhadap penulisnya.

## Bukan Pelarian, tapi Pembebasan

Menulis secara anonim bukan berarti melarikan diri dari tanggung jawab. Ini berarti memindahkan tanggung jawab dari persona ke substansi. Bukan siapa yang berbicara, tapi apa yang dikatakan.

Ini adalah pembebasan yang sesungguhnya.

---

Tulislah. Tanpa nama jika perlu. Yang penting, tulislah.`,
    tags: ['anonymous', 'identity', 'writing'],
    language: 'id',
    anonymous: true,
    draft: false,
  },
  {
    title: 'The Body in the Machine',
    content: `Labor has been digitized. Exploitation has been gamified. The gig economy is a cage built from freedom.

## Platform Labor and the Illusion of Independence

They called it the "gig economy" as if it were jazz — spontaneous, free, joyful. What it actually is: piece-rate labor with no benefits, no protections, and an employer who is also your landlord, your dispatcher, and your judge.

The platform sets the rate. The platform sets the rules. The platform can deactivate you at any time, for any reason, with no appeal.

This is not freedom. This is feudalism with a UX layer.

## The Gamification of Survival

The most insidious part is the gamification. Stars, ratings, acceptance rates, completion rates. Each metric is a small lever of control, invisible in isolation, totalizing in aggregate.

> You are not rated as a worker. You are rated as a human being. And if your rating drops below a certain number, you stop existing in the platform's economy.

## What Resistance Looks Like

Resistance is not always dramatic. Sometimes it is:

- Refusing to check the app on your day off
- Organizing with other drivers, riders, cleaners
- Building alternatives, cooperatives, mutual aid
- Writing, naming, refusing the euphemism

This is one small act of naming.`,
    tags: ['labor', 'platform', 'politics', 'resistance'],
    language: 'en',
    anonymous: false,
    draft: false,
  },
  {
    title: 'Three Fragments on Forgetting',
    content: `**I.**

Memory is political.
What we are permitted to remember
shapes what we are permitted to want.

The archive is a form of resistance.
Every word saved is a word they cannot erase.

---

**II.**

They will tell you to move on.
They will say: why are you still talking about this?
It happened so long ago.

But the wound that is not named
is the wound that does not heal.
It just moves inward
and becomes something else.

Name the wound.
Write it down.
Put it somewhere it cannot be deleted.

---

**III.**

There are things I know that I cannot prove.
There are things I've seen that left no trace.
There are conversations that happened
in rooms with no recording devices
and no witnesses who will speak.

This is why we write.
Not to prove.
To remember.
To say: I was here, this happened, it mattered.

---

*These fragments are dedicated to everyone who was told their experience was not real.*`,
    tags: ['poetry', 'memory', 'resistance'],
    language: 'en',
    anonymous: true,
    draft: false,
  },
]

// To use this seed data in your app for testing,
// you can call createPost() from lib/firestore.ts in a test environment.
// Example usage in browser console with Firebase auth:
//
// import { SEED_POSTS } from './scripts/seed'
// import { createPost } from './lib/firestore'
// for (const post of SEED_POSTS) {
//   await createPost('YOUR_UID', post)
// }
