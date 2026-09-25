import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { CROPS, MARKETS } from '../data/mockData'
import type { ForecastDays, PredictionRequest } from '../types'

interface Props {
  onSubmit: (req: PredictionRequest) => void
  loading: boolean
}

const PERIODS: ForecastDays[] = [7, 14, 30]

export default function PredictionForm({ onSubmit, loading }: Props) {
  const [crop, setCrop] = useState<string>(CROPS[0])
  const [market, setMarket] = useState<string>(MARKETS[0])
  const [days, setDays] = useState<ForecastDays>(7)
  const [quantity, setQuantity] = useState<number>(100)

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="text-[19px] font-semibold text-ink">Predict a crop price</h2>
      <p className="mt-1 text-[13.5px] text-muted">
        Select the crop, market, and forecast period.
      </p>

      <form
        className="mt-6 flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({ crop, market, forecast_days: days, quantity })
        }}
      >
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink">Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink">Market</label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          >
            {MARKETS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink">Forecast period</label>
          <div className="grid grid-cols-3 gap-2">
            {PERIODS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setDays(p)}
                className={`focus-ring rounded-md border px-3 py-2 text-[13.5px] font-medium transition-colors ${
                  days === p
                    ? 'border-agricon bg-agricon-faint text-agricon-deep'
                    : 'border-line text-muted hover:text-ink'
                }`}
              >
                {p} days
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink">Quantity</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted">
              kg
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-1 flex items-center justify-center gap-2 rounded-md bg-agricon px-4 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-agricon-deep disabled:cursor-not-allowed disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing market data…
            </>
          ) : (
            <>
              Predict price
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
