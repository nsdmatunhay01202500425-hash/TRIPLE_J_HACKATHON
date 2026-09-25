import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MARKET_MAP } from '../data/mockData'
import type { MarketMapEntry } from '../types'

export default function MarketMap() {
  const [selected, setSelected] = useState<MarketMapEntry>(MARKET_MAP[0])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="relative rounded-lg border border-line bg-agricon-faint p-4">
        <svg viewBox="0 0 100 100" className="h-[380px] w-full">
          {/* Simplified landmass silhouette, not a precise geographic boundary */}
          <path
            d="M35 8 L45 6 L48 14 L44 22 L50 30 L46 40 L52 46 L48 56 L54 62 L50 72 L58 78 L54 88 L44 92 L40 84 L46 76 L38 70 L42 60 L34 54 L40 46 L32 40 L36 30 L28 24 L34 16 Z"
            fill="#DCEBDD"
            stroke="#C4DBC6"
            strokeWidth="0.5"
          />
          {MARKET_MAP.map((entry) => (
            <g key={entry.market}>
              <circle
                cx={entry.x}
                cy={entry.y}
                r={selected.market === entry.market ? 3.2 : 2.4}
                fill={selected.market === entry.market ? '#173B22' : '#2E7D32'}
                stroke="white"
                strokeWidth="1"
                className="cursor-pointer transition-all"
                onClick={() => setSelected(entry)}
              />
              <text
                x={entry.x}
                y={entry.y - 4}
                fontSize="3"
                textAnchor="middle"
                fill="#173B22"
                className="pointer-events-none select-none font-medium"
              >
                {entry.market.replace(' City', '')}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-1 text-center text-[12px] text-muted">
          Simplified map for illustration · tap a market to see details
        </p>
      </div>

      <div className="rounded-lg border border-line bg-white p-6">
        <h3 className="text-[16px] font-semibold text-ink">{selected.market}</h3>
        <p className="text-[13px] text-muted">{selected.crop}</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[12px] text-muted">Current</div>
            <div className="mt-0.5 text-[18px] font-semibold text-ink">
              ₱{selected.currentPrice.toFixed(2)}/kg
            </div>
          </div>
          <div>
            <div className="text-[12px] text-muted">7-day prediction</div>
            <div className="mt-0.5 text-[18px] font-semibold text-ink">
              ₱{selected.predictedPrice.toFixed(2)}/kg
            </div>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-1 rounded-md bg-agricon-faint px-2 py-0.5 text-[12.5px] font-medium text-agricon-deep">
          <ArrowUpRight size={12} />
          {selected.weeklyChange.toFixed(1)}% over 7 days
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <div className="text-[12px] text-muted">Demand</div>
            <div className="mt-0.5 text-[14px] font-medium text-ink">{selected.demand}</div>
          </div>
          <div>
            <div className="text-[12px] text-muted">Supply</div>
            <div className="mt-0.5 text-[14px] font-medium text-ink">{selected.supply}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
