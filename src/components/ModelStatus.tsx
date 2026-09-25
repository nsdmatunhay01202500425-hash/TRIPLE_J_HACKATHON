import type { ModelStatus as Status } from '../types'

const CONFIG: Record<Status, { label: string; dot: string; pulse: boolean }> = {
  online: { label: 'AI model online', dot: 'bg-agricon', pulse: false },
  unavailable: { label: 'Model unavailable', dot: 'bg-red-400', pulse: false },
  processing: { label: 'Generating prediction…', dot: 'bg-agricon', pulse: true },
}

export default function ModelStatus({ status }: { status: Status }) {
  const c = CONFIG[status]
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-2.5 py-1 text-xs text-muted">
      <span className="relative flex h-1.5 w-1.5">
        {c.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dot} opacity-60`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${c.dot}`} />
      </span>
      {c.label}
    </div>
  )
}
