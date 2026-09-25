import type { PredictionFactors } from '../types'

const LABELS: Record<keyof PredictionFactors, string> = {
  historical_price: 'Historical price',
  supply: 'Supply',
  demand: 'Demand',
  seasonality: 'Seasonality',
  weather_logistics: 'Weather & logistics',
}

export default function ModelFactors({ factors }: { factors: PredictionFactors }) {
  const rows = (Object.keys(factors) as (keyof PredictionFactors)[]).map((key) => ({
    key,
    label: LABELS[key],
    value: factors[key],
  }))

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h3 className="text-[15px] font-semibold text-ink">Why is the model predicting this price?</h3>
      <p className="mt-1 text-[12.5px] text-muted">Example model feature contribution</p>

      <div className="mt-5 flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-ink">{row.label}</span>
              <span className="font-medium text-muted">{Math.round(row.value * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-agricon-faint">
              <div
                className="h-1.5 rounded-full bg-agricon"
                style={{ width: `${Math.round(row.value * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-muted">
        Feature weights vary by crop, market, and model version. These figures illustrate this
        prediction and are not fixed across every forecast.
      </p>
    </div>
  )
}
