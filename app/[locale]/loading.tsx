export default function Loading() {
  return (
    <div className="min-h-dvh pt-14 flex items-center justify-center">
      <div className="text-center">
        <p
          className="font-display text-4xl text-white tracking-widest mb-4"
          style={{ animation: 'flicker 3s infinite' }}
        >
          ANARCHYNESIA
        </p>
        <div className="relative w-40 h-px bg-void-border mx-auto overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blood"
            style={{
              width: '40%',
              animation: 'slideRight 1.4s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes slideRight {
            0% { transform: translateX(-100%) }
            100% { transform: translateX(350%) }
          }
        `}</style>
      </div>
    </div>
  )
}
