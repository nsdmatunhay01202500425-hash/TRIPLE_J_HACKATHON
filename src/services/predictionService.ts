/**
 * predictionService.ts
 * ------------------------------------------------------------------
 * This is the single integration point between the AgriSense frontend
 * and the price-prediction backend.
 *
 * Right now `getPrediction` resolves with generated sample data so the
 * whole app is usable end-to-end without a live model. When the real
 * ML service is ready, replace the body of `getPrediction` with a
 * fetch() call to the production endpoint below — no other file in
 * the app needs to change, since every component only imports from
 * this service.
 *
 *   POST /api/v1/predict
 *   Request:  PredictionRequest  (see src/types/index.ts)
 *   Response: PredictionResponse (see src/types/index.ts)
 */

import { BASE_PRICES, generateForecastPrices, generateHistoricalPrices } from '../data/mockData'
import type { PredictionRequest, PredictionResponse } from '../types'

const USE_MOCK = true // flip to false once PREDICTION_API_URL is live
const PREDICTION_API_URL = import.meta.env.VITE_PREDICTION_API_URL ?? '/api/v1/predict'

function hashSeed(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 100000
  }
  return hash || 1
}

async function getMockPrediction(req: PredictionRequest): Promise<PredictionResponse> {
  // Simulate network + inference latency
  await new Promise((resolve) => setTimeout(resolve, 1100 + Math.random() * 500))

  const base = BASE_PRICES[req.crop] ?? 60
  const seed = hashSeed(`${req.crop}-${req.market}-${req.forecast_days}`)
  const historical = generateHistoricalPrices(base, 60, seed)
  const currentPrice = historical[historical.length - 1].price

  // Simple deterministic "movement" so the same inputs give the same demo result
  const rand = (seed % 1000) / 1000
  const directionalPull = 0.03 + rand * 0.08 // 3%–11% move
  const seasonalityBias = req.forecast_days >= 30 ? 1.15 : req.forecast_days >= 14 ? 1.05 : 1
  const predictedPrice =
    Math.round(currentPrice * (1 + directionalPull * seasonalityBias) * 100) / 100

  const forecast = generateForecastPrices(currentPrice, predictedPrice, req.forecast_days, seed + 7)
  const confidence = Math.max(0.62, Math.min(0.94, 0.94 - req.forecast_days / 300))

  return {
    crop: req.crop,
    market: req.market,
    current_price: currentPrice,
    predicted_price: predictedPrice,
    confidence: Math.round(confidence * 100) / 100,
    forecast_days: req.forecast_days,
    historical_prices: historical,
    forecast_prices: forecast,
    factors: {
      historical_price: 0.28,
      supply: 0.24,
      demand: 0.22,
      seasonality: 0.16,
      weather_logistics: 0.1,
    },
    quantity: req.quantity,
    generated_at: new Date().toISOString(),
  }
}

async function getLivePrediction(req: PredictionRequest): Promise<PredictionResponse> {
  const res = await fetch(PREDICTION_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    throw new Error(`Prediction request failed with status ${res.status}`)
  }

  return (await res.json()) as PredictionResponse
}

export async function getPrediction(req: PredictionRequest): Promise<PredictionResponse> {
  if (USE_MOCK) {
    return getMockPrediction(req)
  }
  return getLivePrediction(req)
}

export async function checkModelHealth(): Promise<'online' | 'unavailable'> {
  if (USE_MOCK) {
    return 'online'
  }
  try {
    const res = await fetch(PREDICTION_API_URL.replace('/predict', '/health'))
    return res.ok ? 'online' : 'unavailable'
  } catch {
    return 'unavailable'
  }
}
