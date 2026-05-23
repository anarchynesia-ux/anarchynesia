'use client'

export function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="crt-overlay"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      />
      {/* Vignette */}
      <div
        className="fixed inset-0 z-[9997] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
