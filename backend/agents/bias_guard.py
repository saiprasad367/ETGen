import yfinance as yf
import numpy as np
from pipeline.state import SignalState
from audit.logger import AuditLogger

def bias_guard_node(state: SignalState) -> SignalState:
    ticker = state["ticker"]
    AuditLogger.log_step(state["signal_id"], "bias_guard", "STARTED", ticker)
    
    bias_warnings = []
    bias_ok = True
    retail_pct = 0
    
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="30d", interval="1d")
        
        if not hist.empty:
            close = hist["Close"].values
            volume = hist["Volume"].values
            
            # === FOMO BIAS: price up >12% in 5 days ===
            if len(close) >= 5:
                five_day_return = (close[-1] - close[-6]) / close[-6] if close[-6] > 0 else 0
                if five_day_return > 0.12:
                    bias_warnings.append(f"FOMO detected: stock up {five_day_return*100:.1f}% in 5 days")
                    bias_ok = False
            
            # === HERDING BIAS: abnormal volume surge ===
            if len(volume) >= 20:
                avg_vol = np.mean(volume[-20:])
                recent_vol = np.mean(volume[-3:])
                vol_ratio = recent_vol / avg_vol if avg_vol > 0 else 1
                retail_pct = min(85, int(20 + vol_ratio * 15))  # approximate
                if vol_ratio > 3.0:
                    bias_warnings.append(f"Herding bias: volume {vol_ratio:.1f}× average -- retail rush detected")
                    bias_ok = False
            
            # === OVERCONFIDENCE: near 52-week high ===
            info = stock.info
            high_52w = info.get("fiftyTwoWeekHigh", 0)
            current = close[-1] if len(close) > 0 else 0
            if high_52w > 0 and current > high_52w * 0.97:
                bias_warnings.append(f"Near 52-week high (₹{high_52w:.0f}) -- anchoring bias risk")
                # Don't block, just warn
            
            # === RECENCY BIAS: only 3-day trend, not 90-day ===
            if len(close) >= 30:
                short_trend = (close[-1] - close[-4]) / close[-4] if close[-4] > 0 else 0
                long_trend = (close[-1] - close[-30]) / close[-30] if close[-30] > 0 else 0
                if short_trend > 0.08 and long_trend < 0:
                    bias_warnings.append("Recency bias: 3-day surge contradicts 30-day downtrend")
                    bias_ok = False
    
    except Exception as e:
        print(f"BiasGuard error: {e}")
    
    state["bias_ok"] = bias_ok
    state["bias_warnings"] = bias_warnings
    state["bias_message"] = (
        bias_warnings[0] if bias_warnings
        else f"Retail at {retail_pct}% -- no herding detected"
    )
    state["retail_pct"] = retail_pct
    
    AuditLogger.log_step(state["signal_id"], "bias_guard",
                         "BLOCKED" if not bias_ok else "CLEARED", ticker,
                         details=" | ".join(bias_warnings) if bias_warnings else "No bias detected")
    return state
