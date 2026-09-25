export type Crop = 'Tomato' | 'Rice' | 'Onion' | 'Corn' | 'Eggplant' | 'Banana'

export type Market =
  | 'Davao City'
  | 'Tagum City'
  | 'Panabo City'
  | 'General Santos'
  | 'Manila'

export type ForecastDays = 7 | 14 | 30

export interface PredictionRequest {
  crop: string
  market: string
  forecast_days: ForecastDays
  quantity: number
}

export interface PricePoint {
  date: string
  price: number
  type: 'historical' | 'forecast'
  rangeLow?: number
  rangeHigh?: number
}

export interface PredictionFactors {
  historical_price: number
  supply: number
  demand: number
  seasonality: number
  weather_logistics: number
}

export interface PredictionResponse {
  crop: string
  market: string
  current_price: number
  predicted_price: number
  confidence: number
  forecast_days: ForecastDays
  historical_prices: PricePoint[]
  forecast_prices: PricePoint[]
  factors: PredictionFactors
  quantity: number
  generated_at: string
}

export interface MarketRow {
  market: string
  currentPrice: number
  predictedPrice: number
  change: number
}

export interface MarketMapEntry {
  market: string
  x: number
  y: number
  crop: string
  currentPrice: number
  predictedPrice: number
  weeklyChange: number
  demand: 'Low' | 'Moderate' | 'High'
  supply: 'Low' | 'Moderate' | 'High'
}

export type ModelStatus = 'online' | 'unavailable' | 'processing'
