import { Activity, ArrowUpRight, Droplets, Package } from 'lucide-react'
import { MARKET_SIGNALS } from '../data/mockData'

const CONDITIONS = [
  { label: 'Demand', value: 'High', icon: Droplets },
  { label: 'Supply', value: 'Moderate', icon: Package },
  { label: 'Price trend', value: 'Increasing', icon: ArrowUpRight },
  { label: 'Market activity', value: 'Active', icon: Activity },
]

export default function Intelligence() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <h1 className="text-[22px] font-semibold text-ink">Market Intelligence</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        A snapshot of current conditions across monitored markets.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONDITIONS.map((c) => (
          <div key={c.label} className="rounded-lg border border-line bg-white p-5">
            <c.icon size={16} className="text-agricon" />
            <div className="mt-3 text-[12px] text-muted">{c.label}</div>
            <div className="mt-0.5 text-[16px] font-semibold text-ink">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-line bg-white p-6">
        <h2 className="text-[15px] font-semibold text-ink">Market signals</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {MARKET_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-start gap-2.5 text-[13.5px] text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agricon" />
              {signal}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
