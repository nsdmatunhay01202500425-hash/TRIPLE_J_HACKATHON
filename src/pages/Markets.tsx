import MarketMap from '../components/MarketMap'
import MarketComparison from '../components/MarketComparison'
import { MARKET_COMPARISON } from '../data/mockData'

export default function Markets() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <h1 className="text-[22px] font-semibold text-ink">Philippine Market Map</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        Explore current and predicted prices across Philippine agricultural markets.
      </p>

      <div className="mt-6">
        <MarketMap />
      </div>

      <div className="mt-10">
        <MarketComparison rows={MARKET_COMPARISON} />
      </div>
    </div>
  )
}
