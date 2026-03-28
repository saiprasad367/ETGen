import os, json
from datetime import datetime
from pipeline.state import SignalState
from audit.logger import AuditLogger

def orchestrator_node(state: SignalState) -> SignalState:
    ticker = state["ticker"]
    AuditLogger.log_step(state["signal_id"], "orchestrator", "STARTED", ticker)
    
    pattern = state.get("pattern_data", {})
    filings = state.get("filings_data", {})
    confidence = state.get("confidence", 0)
    
    # Determine sentiment
    pattern_type = pattern.get("type", "no_pattern")
    if pattern_type in ["cup_handle", "inv_hs", "triangle"]:
        sentiment = "bullish"
    elif pattern_type in ["bearish_flag"]:
        sentiment = "bearish"
    else:
        sentiment = "neutral"
    
    # Build signal metrics
    metrics = {
        "Confidence": f"{confidence}%",
        "Pattern Hit Rate": f"{pattern.get('hit_rate', 0)}%",
        "Breakout": f"₹{pattern.get('entry', 0):,.0f}",
        "Target": f"₹{pattern.get('target', 0):,.0f}",
        "Volume": f"{pattern.get('volume_ratio', 1):.1f}x",
        "RSI": str(pattern.get("rsi", 0)),
        "Risk": "LOW" if confidence > 80 else "MODERATE" if confidence > 65 else "HIGH"
    }
    
    agents_triggered = ["FilingsWatcher", "ChartPatternAI", "BiasGuard", "ExplainerAgent", "Orchestrator"]
    
    # Build complete signal event
    signal_event = {
        "id": state["signal_id"],
        "ticker": ticker.replace(".NS", ""),
        "company_name": filings.get("company_name", ticker.replace(".NS", "")),
        "sector": filings.get("sector", "Unknown"),
        "price": filings.get("current_price", 0),
        "change_pct": 0,
        "sentiment": sentiment,
        "confidence": confidence,
        "agents_triggered": agents_triggered,
        "signal_body": state.get("signal_body", ""),
        "signal_body_hindi": state.get("signal_body_hindi", ""),
        "metrics": metrics,
        "bias_ok": state.get("bias_ok", True),
        "bias_message": state.get("bias_message", ""),
        "retail_pct": state.get("retail_pct", 0),
        "pattern_type": pattern_type,
        "pattern_points": pattern.get("pattern_points", [])[-20:] if pattern.get("pattern_points") else [],
        "ohlcv": pattern.get("ohlcv", {}),
        "target": pattern.get("target", 0),
        "stop_loss": pattern.get("stop_loss", 0),
        "hit_rate": pattern.get("hit_rate", 0),
        "filing_found": filings.get("found", False),
        "filing_type": filings.get("type"),
        "filing_quantity": filings.get("quantity", 0),
        "timestamp": state["timestamp"],
        "audit_trail": state.get("audit_trail", [])
    }
    
    state["signal"] = signal_event
    state["delivered"] = True
    
    AuditLogger.log_step(state["signal_id"], "orchestrator", "DELIVERED", ticker)
    return state
