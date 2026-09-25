/**
 * mockData.ts
 * ------------------------------------------------------------------
 * SAMPLE / DEMO DATA ONLY.
 * This file simulates the shape of data that will eventually come
 * from AgriSense's live market database and ML prediction service.
 * Nothing here should be treated as real market pricing.
 * See src/services/predictionService.ts for how this is consumed
 * and where the real API call will replace it.
 * ------------------------------------------------------------------
 */

import type { MarketMapEntry, MarketRow, PricePoint } from '../types'

export const CROPS = [
  'Rice',
  'Tomato',
  'Corn',
  'Pechay',
  'Sayote',
  'Onion',
  'Garlic',
  'Durian',
  'Mangga',
  'Kamote',
  'Other',
] as const

export const MARKETS = [
  'Davao City',
  'Tagum City',
  'Panabo City',
  'General Santos',
  'Manila',
  'Other',
] as const

export const BASE_PRICES: Record<string, number> = {
  Rice: 57.0,
  Tomato: 88.7,
  Corn: 51.6,
  Pechay: 62.0,
  Sayote: 36.0,
  Onion: 150.2,
  Garlic: 95.3,
  Durian: 75.0,
  Mangga: 80.0,
  Kamote: 40.0,
  Other: 60.0,
}

// Deterministic pseudo-random generator so demo numbers stay stable per session
function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

export function generateHistoricalPrices(basePrice: number, days = 60, seed = 1): PricePoint[] {
  const rand = seededRandom(seed)
  const points: PricePoint[] = []
  let price = basePrice * 0.9
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const drift = (rand() - 0.48) * (basePrice * 0.03)
    price = Math.max(basePrice * 0.6, price + drift)
    points.push({
      date: date.toISOString().slice(0, 10),
      price: Math.round(price * 100) / 100,
      type: 'historical',
    })
  }
  return points
}

export function generateForecastPrices(
  lastPrice: number,
  targetPrice: number,
  days: number,
  seed = 2
): PricePoint[] {
  const rand = seededRandom(seed)
  const points: PricePoint[] = []
  const today = new Date()
  const step = (targetPrice - lastPrice) / days

  for (let i = 1; i <= days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const noise = (rand() - 0.5) * (Math.abs(step) * 0.6 + 0.2)
    const price = lastPrice + step * i + noise
    const spread = targetPrice * 0.015 * (i / days) + targetPrice * 0.01
    points.push({
      date: date.toISOString().slice(0, 10),
      price: Math.round(price * 100) / 100,
      type: 'forecast',
      rangeLow: Math.round((price - spread) * 100) / 100,
      rangeHigh: Math.round((price + spread) * 100) / 100,
    })
  }
  return points
}

export const MARKET_COMPARISON: MarketRow[] = [
  { market: 'Davao City', currentPrice: 88.7, predictedPrice: 96.8, change: 9.1 },
  { market: 'Tagum City', currentPrice: 84.5, predictedPrice: 90.2, change: 6.7 },
  { market: 'Panabo City', currentPrice: 86.6, predictedPrice: 91.7, change: 5.8 },
  { market: 'General Santos', currentPrice: 91.7, predictedPrice: 94.0, change: 2.5 },
]

// Rough relative x/y positions for a simplified Mindanao-focused market map (percent of viewBox)
export const MARKET_MAP: MarketMapEntry[] = [
  {
    market: 'Davao City',
    x: 61,
    y: 68,
    crop: 'Tomato',
    currentPrice: 88.7,
    predictedPrice: 96.8,
    weeklyChange: 9.1,
    demand: 'High',
    supply: 'Moderate',
  },
  {
    market: 'Tagum City',
    x: 58,
    y: 58,
    crop: 'Tomato',
    currentPrice: 84.5,
    predictedPrice: 90.2,
    weeklyChange: 6.7,
    demand: 'Moderate',
    supply: 'Moderate',
  },
  {
    market: 'Panabo City',
    x: 55,
    y: 62,
    crop: 'Tomato',
    currentPrice: 86.6,
    predictedPrice: 91.7,
    weeklyChange: 5.8,
    demand: 'Moderate',
    supply: 'High',
  },
  {
    market: 'General Santos',
    x: 50,
    y: 82,
    crop: 'Corn',
    currentPrice: 51.6,
    predictedPrice: 52.9,
    weeklyChange: 2.5,
    demand: 'High',
    supply: 'Low',
  },
  {
    market: 'Manila',
    x: 38,
    y: 18,
    crop: 'Rice',
    currentPrice: 57.0,
    predictedPrice: 58.9,
    weeklyChange: 3.3,
    demand: 'High',
    supply: 'High',
  },
]

export const MARKET_SIGNALS = [
  'Tomato demand increased in Davao markets over the past week.',
  'Supply is currently moderate across Davao Region collection points.',
  'Prices have increased for three consecutive weeks in Southern Mindanao.',
  'Onion supply from Nueva Ecija has begun arriving in Manila markets.',
]
