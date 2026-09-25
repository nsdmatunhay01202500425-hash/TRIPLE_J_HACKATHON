import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1 text-[12.5px] text-muted">
              <TrendingUp size={13} className="text-agricon" />
              AI Agricultural Price Prediction
            </div>

            <h1 className="mt-5 text-[38px] font-bold leading-[1.15] tracking-tight text-ink sm:text-[46px]">
              Know the price before you sell.
            </h1>

            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted">
              AgriSense uses market data and machine learning to estimate future agricultural
              prices and help farmers make informed selling decisions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/predict"
                className="focus-ring flex items-center justify-center gap-2 rounded-md bg-agricon px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-agricon-deep"
              >
                Try Price Prediction
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/markets"
                className="focus-ring flex items-center justify-center gap-2 rounded-md border border-line px-5 py-3 text-[14.5px] font-semibold text-ink hover:bg-agricon-faint"
              >
                Explore Market Prices
              </Link>
            </div>
          </div>

          <HeroChart />
        </div>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                q: 'What is the current price?',
                a: 'Live reference prices pulled from Philippine agricultural markets.',
              },
              {
                q: 'What does the AI predict?',
                a: 'A market-specific forecast for your crop, over the period you choose.',
              },
              {
                q: 'Why does the model expect that price?',
                a: 'A breakdown of the supply, demand, and seasonal factors behind the number.',
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="text-[15px] font-semibold text-ink">{item.q}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroChart() {
  const points = [40, 44, 42, 48, 52, 50, 58, 55, 62, 68]
  const forecastPoints = [68, 74, 79, 86]
  const w = 320
  const h = 160
  const max = 90
  const toX = (i: number, total: number) => (i / (total - 1)) * w
  const toY = (v: number) => h - (v / max) * h

  const histPath = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i, points.length)} ${toY(v)}`).join(' ')
  const fullForecast = [points[points.length - 1], ...forecastPoints]
  const forePath = fullForecast
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i, fullForecast.length) + toX(points.length - 1, points.length)} ${toY(v)}`)
    .join(' ')

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[12px] text-muted">Tomato · Davao City</div>
          <div className="mt-1 text-[22px] font-bold text-ink">₱89.50/kg</div>
        </div>
        <div className="rounded-md bg-agricon-faint px-2 py-1 text-[12.5px] font-medium text-agricon-deep">
          +9.1%
        </div>
      </div>
      <svg viewBox={`0 0 ${w * 1.4} ${h}`} className="mt-4 h-40 w-full">
        <path d={histPath} fill="none" stroke="#173B22" strokeWidth="2" />
        <path d={forePath} fill="none" stroke="#2E7D32" strokeWidth="2" strokeDasharray="5 4" />
      </svg>
      <div className="flex items-center gap-4 text-[12px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-[2px] w-4 bg-agricon-deep" /> Historical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[2px] w-4 border-t-2 border-dashed border-agricon" /> AI prediction
        </span>
      </div>
    </div>
  )
}
