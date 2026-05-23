import { Suspense } from 'react'
import { PublishEditor } from './PublishEditor'

export default function PublishPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-14 min-h-dvh flex items-center justify-center">
          <p className="mono-label text-void-muted animate-pulse">Loading editor...</p>
        </div>
      }
    >
      <PublishEditor />
    </Suspense>
  )
}
