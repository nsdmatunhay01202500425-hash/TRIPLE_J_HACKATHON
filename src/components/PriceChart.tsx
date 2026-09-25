import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PredictionResponse } from '../types'

interface Props {
  data: PredictionResponse
}

function formatDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PriceChart({ data }: Props) {
  const merged = [
    ...data.historical_prices.map((p) => ({
      date: p.date,
      historical: p.price,
      forecast: null as number | null,
      rangeLow: null as number | null,
      rangeHigh: null as number | null,
    })),
    ...data.forecast_prices.map((p) => ({
      date: p.date,
      historical: null as number | null,
      forecast: p.price,
      rangeLow: p.rangeLow ?? null,
      rangeHigh: p.rangeHigh ?? null,
    })),
  ]

  // bridge the line so forecast connects visually to the last historical point
  const lastHistorical = data.historical_prices[data.historical_prices.length - 1]
  if (merged.length) {
    const bridgeIndex = data.historical_prices.length
    if (merged[bridgeIndex]) {
      merged[bridgeIndex] = { ...merged[bridgeIndex], forecast: lastHistorical.price }
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Price trend & forecast</h3>
          <p className="text-[13px] text-muted">
            {data.crop} · {data.market}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[12.5px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-4 bg-agricon-deep" /> Historical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-[2px] w-4 border-t-2 border-dashed border-agricon" /> Predicted
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={merged} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null
                const point = payload[0].payload
                const price = point.historical ?? point.forecast
                return (
                  <div className="rounded-md border border-line bg-white px-3 py-2 text-[12.5px] shadow-card">
                    <div className="font-medium text-ink">{formatDate(label)}</div>
                    <div className="mt-0.5 text-agricon-deep">₱{Number(price).toFixed(2)}/kg</div>
                    <div className="text-muted">{data.market}</div>
                    <div className="text-muted">{data.crop}</div>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="rangeHigh"
              stroke="none"
              fill="#2E7D32"
              fillOpacity={0.06}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="rangeLow"
              stroke="none"
              fill="#FAFCFA"
              fillOpacity={1}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#173B22"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#2E7D32"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
