from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio, json, os
from dotenv import load_dotenv

load_dotenv()

from pipeline.graph import run_pipeline
from routes import signals, ticker, chart, heatmap, portfolio

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.signal_connections: list[WebSocket] = []
        self.agent_connections: list[WebSocket] = []

    async def connect_signals(self, ws: WebSocket):
        await ws.accept()
        self.signal_connections.append(ws)

    async def connect_agents(self, ws: WebSocket):
        await ws.accept()
        self.agent_connections.append(ws)

    def disconnect(self, ws: WebSocket):
        self.signal_connections = [c for c in self.signal_connections if c != ws]
        self.agent_connections = [c for c in self.agent_connections if c != ws]

    async def broadcast_signal(self, data: dict):
        dead = []
        for ws in self.signal_connections:
            try:
                await ws.send_json(data)
            except:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

    async def broadcast_agent_status(self, data: dict):
        dead = []
        for ws in self.agent_connections:
            try:
                await ws.send_json(data)
            except:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

manager = ConnectionManager()

# Background pipeline task
async def pipeline_loop():
    """Runs every 60 seconds in demo mode (every 300s in production)"""
    DEMO_MODE = False # Hardcoded off for real data
    interval = 60 # 60 second NSE scan cycle

    watchlist = [
        "TATAPWR.NS", "HDFCBANK.NS", "INFY.NS", "TITAN.NS",
        "RELIANCE.NS", "ICICIBANK.NS", "AXISBANK.NS", "WIPRO.NS",
        "SUNPHARMA.NS", "TATAMOTORS.NS", "ADANIGREEN.NS", "BAJFINANCE.NS"
    ]

    while True:
        for ticker_sym in watchlist:
            try:
                # Update agent status to processing
                await manager.broadcast_agent_status({
                    "agent": "filings_watcher",
                    "status": "processing",
                    "ticker": ticker_sym
                })
                await asyncio.sleep(0.5)

                # Run the LangGraph pipeline
                result = await asyncio.to_thread(run_pipeline, ticker_sym)

                if result and result.get("signal"):
                    signal_data = result["signal"]
                    await manager.broadcast_signal(signal_data)
                    await manager.broadcast_agent_status({
                        "agent": "delivery_orchestrator",
                        "status": "delivered",
                        "ticker": ticker_sym,
                        "signal_id": signal_data["id"]
                    })

            except Exception as e:
                print(f"Pipeline error for {ticker_sym}: {e}")

            await asyncio.sleep(2)  # gap between stocks

        await asyncio.sleep(interval)

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(pipeline_loop())
    yield
    task.cancel()

app = FastAPI(title="ArthDrishti API", lifespan=lifespan)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"])

# WebSocket endpoints
@app.websocket("/ws/signals")
async def ws_signals(websocket: WebSocket):
    await manager.connect_signals(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.websocket("/ws/agents")
async def ws_agents(websocket: WebSocket):
    await manager.connect_agents(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# REST routes
app.include_router(signals.router, prefix="/api")
app.include_router(ticker.router, prefix="/api")
app.include_router(chart.router, prefix="/api")
app.include_router(heatmap.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")

# Expose manager for routes to use
app.state.manager = manager
