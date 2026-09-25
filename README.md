# AgriSense
<<<<<<< HEAD

AI agricultural market intelligence platform for the Philippines — frontend prototype.

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/       Navbar, PredictionForm, PredictionResult, PriceChart,
│                      MarketComparison, ModelFactors, MarketMap, ModelStatus,
│                      ChatWidget, Logo, Footer
├── pages/            Home, Prediction, Markets, History, Intelligence
├── services/         predictionService.ts — talks to the price-prediction backend
│                     chatService.ts — talks to the AgriSense AI chat assistant
├── data/             mockData.ts — sample/demo data, clearly separated from the API layer
├── types/            shared TypeScript types
└── App.tsx
```

## AgriSense AI chat assistant

A floating chat widget (bottom-right, on every page) is available for
farmers to ask about crop prices and profitability. It's a browser port
of the original terminal chatbot (`AGRICON_TRIPLE_J.py`), same persona
and preset prices, now living in `src/services/chatService.ts`.

- **No API key set** → runs in a simple rule-based demo mode (can answer
  preset crop prices and basic small talk).
- **`VITE_GROQ_API_KEY` set** → routes messages through Groq's free cloud
  API using the same "AgriSense AI" system prompt, with full reasoning
  about profitability, logistics, and market comparisons.

Get a free Groq key at https://console.groq.com/keys, then add it to a
`.env` file:

```
VITE_GROQ_API_KEY=gsk_your-key-here
```

**Security note:** this calls Groq directly from the browser, so the key
ships in every request and is visible in devtools. That's fine for local
development, but before deploying publicly, move this call behind a
small backend/proxy that holds the key server-side instead.

## Connecting a real prediction model

All prediction logic is isolated behind `src/services/predictionService.ts`.

1. Set `VITE_PREDICTION_API_URL` in a `.env` file to your backend's endpoint.
2. Flip `USE_MOCK` to `false` in `predictionService.ts`.
3. Make sure your backend returns the shape described in `src/types/index.ts`
   (`PredictionResponse`) — no other file needs to change.

Request shape sent to the backend:

```json
{
  "crop": "Tomato",
  "market": "Davao City",
  "forecast_days": 7,
  "quantity": 100
}
```

## Notes

- All prices, market signals, and map data shown in the UI are **sample data** for
  demonstration purposes only, generated in `src/data/mockData.ts`.
- Design tokens (colors, spacing, type scale) live in `tailwind.config.js`.
=======
Prototype for the hackathon elimination

A smart agent that can help farmers calculate the prices and profitability of crops. It can also track prices of crops in a place.
>>>>>>> 97e27fd320f40ceb559a08173fd7bd72f5a0ead3
