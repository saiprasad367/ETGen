import yfinance as yf
import pandas as pd
from functools import lru_cache
import time
import requests

# Create a session to avoid 429 errors from yfinance
session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"})

NSE_SECTOR_MAP = {
    "IT": ["TCS.NS", "INFY.NS"],
    "Banking": ["HDFCBANK.NS", "ICICIBANK.NS"],
    "Energy": ["RELIANCE.NS", "TATAPWR.NS"],
    "Auto": ["MARUTI.NS", "TATAMOTORS.NS"],
    "FMCG": ["ITC.NS", "HINDUNILVR.NS"]
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
            "vix": "^INDIAVIX"
        }
        result = {}
        for name, sym in indices.items():
            try:
                t = yf.Ticker(sym, session=session)
                hist = t.history(period="2d", interval="1d")
                if len(hist) >= 2:
                    prev = hist["Close"].iloc[-2]
                    curr = hist["Close"].iloc[-1]
                    result[name] = {
                        "value": round(curr, 2),
                        "change_pct": round((curr - prev) / prev * 100, 2) if prev > 0 else 0
                    }
            except Exception as e:
                print(f"Index fetch err {sym}: {e}")
                result[name] = {"value": 0, "change_pct": 0}
        return result
    return get_with_cache("market_data", fetch, ttl=60)

def get_heatmap_data():
    def fetch():
        result = []
        for sector, tickers in NSE_SECTOR_MAP.items():
            sector_data = {"sector": sector, "stocks": []}
            for ticker in tickers[:2]:  # drastically limit for hackathon demo to avoid 429
                try:
                    t = yf.Ticker(ticker, session=session)
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
                except Exception as e:
                    print(f"Heatmap fetch err {ticker}: {e}")
            result.append(sector_data)
        return result
    return get_with_cache("heatmap", fetch, ttl=180)

def get_ohlcv(ticker: str, days: int = 90):
    def fetch():
        t = yf.Ticker(ticker if ".NS" in ticker else ticker + ".NS", session=session)
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
