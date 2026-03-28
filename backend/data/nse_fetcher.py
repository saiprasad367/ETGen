import yfinance as yf
import pandas as pd
from functools import lru_cache
import time

NSE_SECTOR_MAP = {
    "IT": ["TCS.NS", "INFY.NS", "WIPRO.NS", "HCLTECH.NS", "TECHM.NS", "LTI.NS"],
    "Banking": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "KOTAKBANK.NS", "AXISBANK.NS", "INDUSINDBK.NS"],
    "Energy": ["RELIANCE.NS", "ONGC.NS", "NTPC.NS", "TATAPWR.NS", "ADANIGREEN.NS", "POWERGRID.NS"],
    "Pharma": ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "DIVISLAB.NS", "AUROPHARMA.NS"],
    "Auto": ["MARUTI.NS", "TATAMOTORS.NS", "M&M.NS", "BAJAJ-AUTO.NS", "EICHERMOT.NS"],
    "FMCG": ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "BRITANNIA.NS", "DABUR.NS"],
    "Metals": ["TATASTEEL.NS", "JSWSTEEL.NS", "HINDALCO.NS", "COALINDIA.NS", "SAIL.NS"],
    "Telecom": ["BHARTIARTL.NS", "IDEA.NS"],
    "Finance": ["BAJFINANCE.NS", "BAJAJFINSV.NS", "HDFCLIFE.NS", "SBILIFE.NS"],
}

_cache = {}
_cache_ts = {}
CACHE_TTL = 60  # seconds

def get_with_cache(key, fetch_fn, ttl=CACHE_TTL):
    now = time.time()
    if key in _cache and (now - _cache_ts.get(key, 0)) < ttl:
        return _cache[key]
    result = fetch_fn()
    _cache[key] = result
    _cache_ts[key] = now
    return result

def get_market_data():
    def fetch():
        indices = {
            "nifty50": "^NSEI",
            "sensex": "^BSESN",
            "bank_nifty": "^NSEBANK",
            "vix": "^INDIAVIX",
            "usd_inr": "USDINR=X"
        }
        result = {}
        for name, sym in indices.items():
            try:
                t = yf.Ticker(sym)
                hist = t.history(period="2d", interval="1d")
                if len(hist) >= 2:
                    prev = hist["Close"].iloc[-2]
                    curr = hist["Close"].iloc[-1]
                    result[name] = {
                        "value": round(curr, 2),
                        "change_pct": round((curr - prev) / prev * 100, 2) if prev > 0 else 0
                    }
            except:
                result[name] = {"value": 0, "change_pct": 0}
        return result
    return get_with_cache("market_data", fetch, ttl=30)

def get_heatmap_data():
    def fetch():
        result = []
        for sector, tickers in NSE_SECTOR_MAP.items():
            sector_data = {"sector": sector, "stocks": []}
            for ticker in tickers[:5]:  # limit to 5 per sector for speed
                try:
                    t = yf.Ticker(ticker)
                    info = t.info
                    hist = t.history(period="2d")
                    change_pct = 0
                    if len(hist) >= 2:
                        change_pct = (hist["Close"].iloc[-1] - hist["Close"].iloc[-2]) / hist["Close"].iloc[-2] * 100
                    sector_data["stocks"].append({
                        "ticker": ticker.replace(".NS", ""),
                        "name": info.get("shortName", ticker.replace(".NS", "")),
                        "market_cap": info.get("marketCap", 0),
                        "change_pct": round(change_pct, 2),
                        "price": round(info.get("currentPrice", 0) or info.get("regularMarketPrice", 0), 2)
                    })
                except:
                    pass
            result.append(sector_data)
        return result
    return get_with_cache("heatmap", fetch, ttl=120)

def get_ohlcv(ticker: str, days: int = 90):
    def fetch():
        t = yf.Ticker(ticker if ".NS" in ticker else ticker + ".NS")
        hist = t.history(period=f"{days}d", interval="1d")
        return {
            "dates": [str(d.date()) for d in hist.index],
            "open": hist["Open"].round(2).tolist(),
            "high": hist["High"].round(2).tolist(),
            "low": hist["Low"].round(2).tolist(),
            "close": hist["Close"].round(2).tolist(),
            "volume": hist["Volume"].tolist()
        }
    return get_with_cache(f"ohlcv_{ticker}_{days}", fetch, ttl=300)
