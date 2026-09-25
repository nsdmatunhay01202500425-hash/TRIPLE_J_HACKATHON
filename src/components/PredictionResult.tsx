import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'
import type { PredictionResponse } from '../types'

export default function PredictionResult({ data }: { data: PredictionResponse }) {
  const change = ((data.predicted_price - data.current_price) / data.current_price) * 100
  const isUp = change >= 0

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-agricon">
        <Sparkles size={13} />
        AI Forecast
      </div>

      <h3 className="mt-3 text-[15px] text-muted">Predicted market price</h3>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-[36px] font-bold leading-tight text-ink">
          ₱{data.predicted_price.toFixed(2)}
          <span className="text-[16px] font-medium text-muted"> / kg</span>
        </span>
      </div>

      <div
        className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-medium ${
          isUp ? 'bg-agricon-faint text-agricon-deep' : 'bg-red-50 text-red-600'
        }`}
      >
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(change).toFixed(1)}% from current price
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5">
        <div>
          <div className="text-[12px] text-muted">Current price</div>
          <div className="mt-0.5 text-[15px] font-semibold text-ink">
            ₱{data.current_price.toFixed(2)}/kg
          </div>
        </div>
        <div>
          <div className="text-[12px] text-muted">Confidence</div>
          <div className="mt-0.5 text-[15px] font-semibold text-ink">
            {Math.round(data.confidence * 100)}%
          </div>
        </div>
      </div>

      <p className="mt-5 text-[12.5px] leading-relaxed text-muted">
        Prediction based on historical prices, supply, demand, seasonality, and market conditions.
        This is an estimate, not a guarantee of future price.
      </p>
    </div>
  )
}
