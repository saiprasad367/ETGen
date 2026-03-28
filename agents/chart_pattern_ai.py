import yfinance as yf
import pandas as pd
import numpy as np
from pipeline.state import SignalState
from audit.logger import AuditLogger

def calculate_indicators(df: pd.DataFrame):
    """Fallback TA indicators using standard pandas"""
    # RSI
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI_14'] = 100 - (100 / (1 + rs))
    
    # EMA
    df['EMA_20'] = df['Close'].ewm(span=20, adjust=False).mean()
    df['EMA_50'] = df['Close'].ewm(span=50, adjust=False).mean()
    
    # MACD
    exp1 = df['Close'].ewm(span=12, adjust=False).mean()
    exp2 = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    return df

def detect_pattern(df: pd.DataFrame) -> dict:
    """Detect chart patterns in OHLCV data"""
    if len(df) < 30:
        return {"type": "insufficient_data", "confidence": 0, "hit_rate": 0}
    
    df = calculate_indicators(df)
    
    close = df['Close'].values
    recent_vol = volume[-1]
    vol_ratio = recent_vol / avg_vol if avg_vol > 0 else 1

    # === CUP & HANDLE DETECTION ===
    if len(close) >= 40:
        segment = close[-40:]
        left_peak = np.max(segment[:10])
        cup_bottom = np.min(segment[10:30])
        right_peak = np.max(segment[30:40])
        cup_depth = (left_peak - cup_bottom) / left_peak if left_peak > 0 else 0
        symmetry = abs(left_peak - right_peak) / left_peak if left_peak > 0 else 1

        if (0.08 < cup_depth < 0.35 and symmetry < 0.05
                and close[-1] > right_peak * 0.98 and vol_ratio > 1.5 and rsi < 70):
            return {
                "type": "cup_handle",
                "confidence": min(88, int(60 + (vol_ratio - 1) * 20 + (1 - symmetry) * 20)),
                "hit_rate": 68,
                "target": round(close[-1] * (1 + cup_depth * 0.8), 2),
                "stop_loss": round(cup_bottom, 2),
                "entry": round(close[-1], 2),
                "rsi": round(rsi, 1),
                "volume_ratio": round(vol_ratio, 2),
                "pattern_points": segment.tolist()
            }

    # === INVERSE HEAD & SHOULDERS ===
    if len(close) >= 50:
        segment = close[-50:]
        troughs = []
        for i in range(5, len(segment)-5):
            if segment[i] == min(segment[i-5:i+5]):
                troughs.append((i, segment[i]))
        
        if len(troughs) >= 3:
            troughs = sorted(troughs, key=lambda x: x[0])[-3:]
            if (troughs[1][1] < troughs[0][1] and troughs[1][1] < troughs[2][1]
                    and abs(troughs[0][1] - troughs[2][1]) / troughs[0][1] < 0.05
                    and close[-1] > max(segment) * 0.95):
                neckline = (troughs[0][1] + troughs[2][1]) / 2 * 1.05
                return {
                    "type": "inv_hs",
                    "confidence": min(85, int(65 + vol_ratio * 10)),
                    "hit_rate": 72,
                    "target": round(neckline + (neckline - troughs[1][1]), 2),
                    "stop_loss": round(troughs[1][1] * 0.97, 2),
                    "entry": round(close[-1], 2),
                    "rsi": round(rsi, 1),
                    "volume_ratio": round(vol_ratio, 2),
                    "pattern_points": segment.tolist()
                }

    # === ASCENDING TRIANGLE ===
    if len(close) >= 30:
        highs = high[-30:]
        lows = low[-30:]
        high_slope = np.polyfit(range(len(highs)), highs, 1)[0]
        low_slope = np.polyfit(range(len(lows)), lows, 1)[0]
        if abs(high_slope) < 0.1 and low_slope > 0.2:
            resistance = np.mean(highs[-10:])
            return {
                "type": "triangle",
                "confidence": min(80, int(60 + low_slope * 20)),
                "hit_rate": 61,
                "target": round(resistance * 1.06, 2),
                "stop_loss": round(lows[-1] * 0.97, 2),
                "entry": round(close[-1], 2),
                "rsi": round(rsi, 1),
                "volume_ratio": round(vol_ratio, 2),
                "pattern_points": close[-30:].tolist()
            }

    return {"type": "no_pattern", "confidence": 0, "hit_rate": 0}

def chart_pattern_node(state: SignalState) -> SignalState:
    ticker = state["ticker"]
    AuditLogger.log_step(state["signal_id"], "chart_pattern_ai", "STARTED", ticker)
    
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period="6mo", interval="1d")
        
        if df.empty or len(df) < 20:
            state["pattern_data"] = {"type": "no_data", "confidence": 0}
            return state
        
        pattern = detect_pattern(df.copy())
        
        pattern["ohlcv"] = {
            "dates": [str(d.date()) for d in df.index[-60:]],
            "open": df["Open"].iloc[-60:].round(2).tolist(),
            "high": df["High"].iloc[-60:].round(2).tolist(),
            "low": df["Low"].iloc[-60:].round(2).tolist(),
            "close": df["Close"].iloc[-60:].round(2).tolist(),
            "volume": df["Volume"].iloc[-60:].tolist()
        }
        
        state["pattern_data"] = pattern
        state["confidence"] = pattern.get("confidence", 0)
        
    except Exception as e:
        print(f"Chart pattern error for {ticker}: {e}")
        state["pattern_data"] = {"type": "error", "confidence": 0}
    
    AuditLogger.log_step(state["signal_id"], "chart_pattern_ai", "COMPLETED", ticker,
                         details=f"Pattern: {state['pattern_data'].get('type')}, Confidence: {state.get('confidence', 0)}")
    return state
