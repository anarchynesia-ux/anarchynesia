# ANARCHYNESIA
### Digital Resistance Archive — The Underground Writes Back

> Anonymous writings, underground journals, and manifesto fragments from the digital underground. Cinematic brutalist design. No tracking. No ads. No corporate agenda.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | TailwindCSS (custom brutalist design system) |
| Animation | Framer Motion |
| Auth | Firebase Authentication — GitHub OAuth |
| Database | Firebase Firestore |
| i18n | next-intl (EN / ID) |
| Editor | Markdown textarea + react-markdown preview |
| Deployment | Vercel |

---

## Quick Start

```bash
git clone https://github.com/yourname/anarchynesia.git
cd anarchynesia
npm install
cp .env.example .env.local   # fill in Firebase credentials
npm run dev                   # → http://localhost:3000
```

---

## Firebase Setup

1. [Firebase Console](https://console.firebase.google.com) → New project
2. Add Web app → copy config → `.env.local`
3. Authentication → GitHub → enable (needs GitHub OAuth App)
4. Firestore Database → create (production mode)
5. Deploy rules + indexes: `firebase deploy --only firestore:rules,firestore:indexes`
6. Add your Vercel domain to Firebase Authorized Domains

### GitHub OAuth App
- Homepage: `http://localhost:3000`
- Callback: `https://YOUR_PROJECT.firebaseapp.com/__/auth/handler`

---

## Project Structure

```
anarchynesia/
├── app/[locale]/
│   ├── layout.tsx              Root layout (Navbar, Footer, providers)
│   ├── page.tsx                Homepage — hero + featured + quote
│   ├── loading.tsx             Streaming loader
│   ├── error.tsx               Error boundary
│   ├── not-found.tsx           Custom 404
│   ├── journal/page.tsx        Feed (search + tag filter)
│   ├── journal/[slug]/         Post detail (server metadata + client view)
│   ├── login/page.tsx          GitHub auth UI
│   ├── dashboard/page.tsx      User posts management
│   ├── publish/                Markdown editor (Suspense split)
│   ├── about/page.tsx          Manifesto
│   ├── archive/page.tsx        Timeline / tag explorer
│   └── settings/page.tsx       Profile settings
├── components/
│   ├── auth/                   AuthProvider, ProtectedRoute
│   ├── journal/                JournalCard, RelatedPosts, PostActions
│   ├── layout/                 Navbar, Footer
│   └── ui/                     CRTOverlay, LoadingScreen, PageTransition,
│                               GlitchText, AnimatedCounter, TagChip
├── hooks/
│   ├── useAuth.ts              Zustand auth store
│   ├── usePosts.ts             Data fetching with cache
│   ├── useDebounce.ts          Debounce utility
│   └── useLocalStorage.ts      Type-safe localStorage
├── lib/
│   ├── firebase.ts             Firebase init
│   ├── auth.ts                 GitHub sign-in helpers
│   ├── firestore.ts            CRUD operations
│   └── utils.ts                Utilities (formatDate, slugify, etc.)
├── messages/                   EN + ID translations
├── scripts/seed.ts             Sample post data
├── firestore.rules             Security rules
├── firestore.indexes.json      Composite indexes
└── styles/globals.css          Design tokens + global CSS
```

---

## Design System

```
Fonts
  Bebas Neue        Display, hero titles
  DM Serif Display  Article body / prose
  JetBrains Mono    Labels, metadata, code
  Barlow Condensed  UI, nav, buttons

Colors
  #000000  void          Background
  #8b0000  blood         Primary accent
  #888888  ash           Secondary text
  #e8e8e8  ghost-bright  Body text
  #ffffff  white         Headings

Effects
  CRT scanlines · Film grain · Dark vignette
  Blood glow hover · Glitch text · Reading progress bar
```

---

## Seed Sample Data

After first sign-in, run in browser console:

```js
// From scripts/seed.ts — paste SEED_POSTS, then:
const { createPost } = await import('/lib/firestore')
for (const post of SEED_POSTS) {
  await createPost('YOUR_UID', post)
}
```

---

## Deploy

```bash
npm i -g vercel && vercel
# Set NEXT_PUBLIC_FIREBASE_* env vars in Vercel Dashboard
```

---

**Underground software. Use it. Fork it. Resist.**
