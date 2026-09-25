import { useMemo, useState } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BASE_PRICES, CROPS, MARKETS, generateHistoricalPrices } from '../data/mockData'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function History() {
  const [crop, setCrop] = useState<string>(CROPS[0])
  const [market, setMarket] = useState<string>(MARKETS[0])
  const [range, setRange] = useState<30 | 60 | 90>(60)

  const prices = useMemo(() => {
    const base = BASE_PRICES[crop] ?? 60
    const seed = crop.length * 13 + market.length * 7
    return generateHistoricalPrices(base, range, seed)
  }, [crop, market, range])

  const values = prices.map((p) => p.price)
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const high = Math.max(...values)
  const low = Math.min(...values)
  const change = ((values[values.length - 1] - values[0]) / values[0]) * 100

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <h1 className="text-[22px] font-semibold text-ink">Price History</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        Review historical pricing for a crop and market over time.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="focus-ring rounded-md border border-line bg-white px-3 py-2 text-[13.5px] text-ink"
        >
          {CROPS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="focus-ring rounded-md border border-line bg-white px-3 py-2 text-[13.5px] text-ink"
        >
          {MARKETS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          {[30, 60, 90].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as 30 | 60 | 90)}
              className={`focus-ring rounded-md border px-3 py-2 text-[13px] font-medium ${
                range === r ? 'border-agricon bg-agricon-faint text-agricon-deep' : 'border-line text-muted'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Average', value: `₱${avg.toFixed(2)}` },
          { label: 'Highest', value: `₱${high.toFixed(2)}` },
          { label: 'Lowest', value: `₱${low.toFixed(2)}` },
          { label: 'Change', value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-white p-4">
            <div className="text-[12px] text-muted">{s.label}</div>
            <div className="mt-1 text-[18px] font-semibold text-ink">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-6">
        {prices.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-[13.5px] text-muted">
            No historical price data available for this market.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={prices} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#E3E9E3" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11, fill: '#6F7971' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E3E9E3' }}
                  minTickGap={40}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6F7971' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₱${v}`}
                  width={50}
                />
                <Tooltip
                  formatter={(v: number) => [`₱${v.toFixed(2)}/kg`, 'Price']}
                  labelFormatter={(l) => formatDate(l as string)}
                />
                <Area type="monotone" dataKey="price" stroke="none" fill="#2E7D32" fillOpacity={0.05} />
                <Line type="monotone" dataKey="price" stroke="#173B22" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
