import yfinance as yf
import requests
from datetime import datetime
from pipeline.state import SignalState
from audit.logger import AuditLogger

BSE_BULK_DEALS_URL = "https://api.bseindia.com/BseIndiaAPI/api/BulkDealdat/w"

def filings_watcher_node(state: SignalState) -> SignalState:
    ticker = state["ticker"]
    clean_ticker = ticker.replace(".NS", "")
    
    AuditLogger.log_step(state["signal_id"], "filings_watcher", "STARTED", ticker)
    
    filing_signal = {"found": False, "type": None, "quantity": 0, "entity": None, "deal_value": 0}
    
    try:
        # Try BSE bulk deals (public endpoint, no auth)
        resp = requests.get(BSE_BULK_DEALS_URL, timeout=5, headers={
            "User-Agent": "Mozilla/5.0", "Referer": "https://www.bseindia.com"
        })
        if resp.status_code == 200:
            deals = resp.json().get("Table", [])
            for deal in deals:
                deal_scrip = str(deal.get("SCRIP_CD", "") or deal.get("SCRIP_NAME", ""))
                if clean_ticker.upper() in deal_scrip.upper():
                    qty = int(deal.get("QUANTITY", 0) or 0)
                    if qty > 100000:  # 1 lakh shares threshold
                        filing_signal = {
                            "found": True,
                            "type": "BULK_BUY" if deal.get("BUYSELL") == "B" else "BULK_SELL",
                            "quantity": qty,
                            "entity": deal.get("CLIENT_NAME", "Undisclosed entity"),
                            "deal_value": qty * float(deal.get("PRICE", 0) or 0)
                        }
                        break
    except Exception as e:
        print(f"BSE filings fetch error: {e}")
    
    # Also check yfinance for major holders changes
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        filing_signal["company_name"] = info.get("longName", clean_ticker)
        filing_signal["sector"] = info.get("sector", "Unknown")
        filing_signal["market_cap"] = info.get("marketCap", 0)
        filing_signal["current_price"] = info.get("currentPrice") or info.get("regularMarketPrice", 0)
        filing_signal["fifty_two_week_high"] = info.get("fiftyTwoWeekHigh", 0)
        filing_signal["fifty_two_week_low"] = info.get("fiftyTwoWeekLow", 0)
        filing_signal["volume"] = info.get("volume", 0)
        filing_signal["avg_volume"] = info.get("averageVolume", 1)
    except Exception as e:
        print(f"yfinance info error for {ticker}: {e}")
        filing_signal["company_name"] = clean_ticker
        filing_signal["sector"] = "Unknown"
        filing_signal["current_price"] = 0
    
    state["filings_data"] = filing_signal
    AuditLogger.log_step(state["signal_id"], "filings_watcher", "COMPLETED", ticker,
                         details=f"Filing found: {filing_signal['found']}, Qty: {filing_signal.get('quantity', 0)}")
    return state
