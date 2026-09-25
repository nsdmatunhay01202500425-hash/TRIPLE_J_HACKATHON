import { ArrowUpRight } from 'lucide-react'
import type { MarketRow } from '../types'

export default function MarketComparison({ rows }: { rows: MarketRow[] }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h3 className="text-[15px] font-semibold text-ink">Compare Philippine markets</h3>
      <p className="mt-1 text-[13px] text-muted">
        Prices vary by location. This is a comparison, not a ranking.
      </p>

      {/* Table for sm and up */}
      <div className="mt-5 hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">Market</th>
              <th className="py-2 font-medium">Current price</th>
              <th className="py-2 font-medium">Predicted price</th>
              <th className="py-2 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.market} className="border-b border-line last:border-0">
                <td className="py-3 font-medium text-ink">{row.market}</td>
                <td className="py-3 text-muted">₱{row.currentPrice.toFixed(2)}</td>
                <td className="py-3 font-medium text-ink">₱{row.predictedPrice.toFixed(2)}</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-agricon-faint px-2 py-0.5 text-[12.5px] font-medium text-agricon-deep">
                    <ArrowUpRight size={12} />
                    {row.change.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="mt-5 flex flex-col gap-3 sm:hidden">
        {rows.map((row) => (
          <div key={row.market} className="rounded-md border border-line p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink">{row.market}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-agricon-faint px-2 py-0.5 text-[12px] font-medium text-agricon-deep">
                <ArrowUpRight size={12} />
                {row.change.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[13px] text-muted">
              <span>Current: ₱{row.currentPrice.toFixed(2)}</span>
              <span className="font-medium text-ink">Predicted: ₱{row.predictedPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
