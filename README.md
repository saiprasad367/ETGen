# ArthDrishti -- AI Signal Intelligence for Indian Investors
### ET GenAI Hackathon 2026 | Problem Statement 6 | Multi-Agent Pipeline

> अर्थदृष्टि -- "Financial Vision" -- Real-time, bias-aware investment signals for 14 crore Indian retail investors

## Architecture
5-Agent LangGraph Pipeline:
FilingsWatcher -> ChartPatternAI -> BiasGuard -> ExplainerAgent -> DeliveryOrchestrator

## Quick Start
```bash
# Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # Add your GROQ_API_KEY
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

## Tech Stack
- LLM: Groq Llama 3.3 70B (free tier) + Gemini 2.0 Flash (fallback)
- Agents: LangGraph
- Data: yfinance + BSE public APIs
- Frontend: React + Motion + TradingView lightweight-charts + D3.js
- DB: PostgreSQL (audit trail)
- Push: Firebase FCM

## Key Features
1. Live NSE Scanner -- 1,800+ stocks every 60 seconds
2. BiasGuard -- detects 6 cognitive biases (unique in India)
3. Candlestick Pattern Visualizer -- real TradingView charts
4. Insider Trade Tracker -- BSE bulk deal network graph
5. Hindi/English toggle -- Bharat-first
6. Full audit trail -- SEBI-compliant explainability
7. Portfolio Impact Simulator
8. Risk Profile Engine (5 profiles)
9. Market Heatmap -- real-time sector pulse
10. WhatsApp delivery simulation

## Impact
₹750 Cr in investor losses prevented annually (10L users x 15% bias reduction)
