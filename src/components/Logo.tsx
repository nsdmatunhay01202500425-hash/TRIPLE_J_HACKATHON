interface LogoProps {
  size?: number
  showWordmark?: boolean
}

// A geometric "A" built from two strokes and a horizontal crossbar that
// doubles as a leaf vein / data baseline. Reads as agriculture + data
// without an illustrated leaf.
export default function Logo({ size = 28, showWordmark = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#2E7D32" />
        <path
          d="M16 7L23.5 24.5H19.8L16 15.2L12.2 24.5H8.5L16 7Z"
          fill="white"
        />
        <path d="M13 19.5H19" stroke="#2E7D32" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-ink">AgriSense</span>
      )}
    </div>
  )
}
