import { useState } from 'react'
import { AlertCircle, Info } from 'lucide-react'
import PredictionForm from '../components/PredictionForm'
import PredictionResult from '../components/PredictionResult'
import PriceChart from '../components/PriceChart'
import ModelFactors from '../components/ModelFactors'
import MarketComparison from '../components/MarketComparison'
import ModelStatus from '../components/ModelStatus'
import { getPrediction } from '../services/predictionService'
import { MARKET_COMPARISON } from '../data/mockData'
import type { ModelStatus as Status, PredictionRequest, PredictionResponse } from '../types'

export default function Prediction() {
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [status, setStatus] = useState<Status>('online')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(req: PredictionRequest) {
    setStatus('processing')
    setError(null)
    try {
      const data = await getPrediction(req)
      setResult(data)
      setStatus('online')
    } catch {
      setError('Unable to generate prediction. Please check your connection and try again.')
      setStatus('unavailable')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-ink">Price Prediction</h1>
        <ModelStatus status={status} />
      </div>

      <div className="mb-6 flex items-start gap-2.5 rounded-md border border-line bg-agricon-faint px-4 py-3 text-[13px] text-agricon-deep">
        <Info size={16} className="mt-0.5 shrink-0" />
        Prices differ by location, transportation cost, demand, and quality. AgriSense predicts
        prices per market rather than one universal Philippine price.
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <PredictionForm onSubmit={handleSubmit} loading={status === 'processing'} />

        <div className="flex flex-col gap-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-[13.5px] text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {!result && !error && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white p-8 text-center">
              <p className="text-[14px] text-muted">
                Fill in the form and select "Predict price" to see an AI-generated forecast.
              </p>
            </div>
          )}

          {result && (
            <>
              <PredictionResult data={result} />
              <PriceChart data={result} />
              <ModelFactors factors={result.factors} />
            </>
          )}
        </div>
      </div>

      <div className="mt-10">
        <MarketComparison rows={MARKET_COMPARISON} />
      </div>

      <p className="mt-4 text-[12px] text-muted">
        Sample data shown for demonstration. Actual prices may vary by location, quality, buyer,
        and market conditions.
      </p>
    </div>
  )
}
