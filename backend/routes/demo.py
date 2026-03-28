from fastapi import APIRouter, Request
from agents.delivery_orchestrator import orchestrator_node
from pipeline.models import SignalEvent
import uuid
from datetime import datetime

router = APIRouter()

DEMO_SIGNALS = {
    "bullish_breakout": {
        "ticker": "TATAPWR",
        "company_name": "Tata Power Company",
        "sector": "Energy",
        "price": 468.75,
        "change_pct": 3.2,
        "sentiment": "bullish",
        "confidence": 87,
        "signal_body": "FilingsWatcher detected a bulk purchase of 2.3 lakh shares by an undisclosed institutional entity at market open. ChartPatternAI confirmed a Cup & Handle breakout above ₹455 resistance after 18 days of consolidation -- a pattern with 68% historical success on TATAPWR. Volume is 2.8x the 20-day average, confirming institutional conviction.",
        "signal_body_hindi": "फाइलिंग्स वाचर ने बाजार खुलने पर एक अज्ञात संस्थागत संस्था द्वारा 2.3 लाख शेयरों की थोक खरीद का पता लगाया। चार्टपैटर्न AI ने 18 दिनों की समेकन के बाद ₹455 प्रतिरोध से ऊपर कप और हैंडल ब्रेकआउट की पुष्टि की।",
        "metrics": {"Confidence": "87%", "Pattern Hit Rate": "68%", "Breakout": "₹455", "Target": "₹510", "Volume": "2.8x", "RSI": "58", "Risk": "MODERATE"},
        "bias_ok": True,
        "bias_message": "Retail at 22% -- early signal, not FOMO. Safe entry window.",
        "retail_pct": 22,
        "pattern_type": "cup_handle",
        "filing_found": True,
        "filing_type": "BULK_BUY",
        "filing_quantity": 230000,
    },
    "bias_warning": {
        "ticker": "PAYTM",
        "company_name": "One97 Communications",
        "sector": "Fintech",
        "price": 412.60,
        "change_pct": -2.4,
        "sentiment": "bearish",
        "confidence": 72,
        "signal_body": "BiasGuard has BLOCKED this signal. 76% of recent buyers are retail investors -- a classic herding bias indicator. Despite a 3-day price uptick, the 30-day trend is negative and promoter pledging increased ₹340 Cr last quarter. Following this signal would mean joining the crowd at exactly the wrong time.",
        "signal_body_hindi": "बायसगार्ड ने इस सिग्नल को BLOCKED किया है। हाल के 76% खरीदार खुदरा निवेशक हैं -- झुंड पूर्वाग्रह का एक क्लासिक संकेतक।",
        "metrics": {"Confidence": "72%", "Pattern Hit Rate": "58%", "Breakout": "--", "Target": "₹385", "Volume": "3.2x", "RSI": "71", "Risk": "HIGH"},
        "bias_ok": False,
        "bias_message": "⚠️ BLOCKED: Herding bias -- 76% retail crowded, exit trap possible",
        "retail_pct": 76,
        "pattern_type": "bearish_flag",
        "filing_found": False,
        "filing_type": None,
        "filing_quantity": 0,
    },
    "insider_buy": {
        "ticker": "TITAN",
        "company_name": "Titan Company",
        "sector": "Consumer",
        "price": 3642.15,
        "change_pct": 2.1,
        "sentiment": "bullish",
        "confidence": 83,
        "signal_body": "FilingsWatcher detected the MD acquired 50,000 shares at ₹3,580 yesterday (₹17.9 Cr personal investment). When insiders invest this significantly, it signals strong conviction about upcoming catalysts. ChartPatternAI confirms ascending triangle breakout. Festive season demand data from recent management commentary suggests 18% YoY growth in jewellery division.",
        "signal_body_hindi": "फाइलिंग्स वाचर ने MD द्वारा कल ₹3,580 पर 50,000 शेयरों की खरीद का पता लगाया (₹17.9 करोड़ का व्यक्तिगत निवेश)।",
        "metrics": {"Confidence": "83%", "Pattern Hit Rate": "61%", "Breakout": "₹3,580", "Target": "₹3,900", "Volume": "1.9x", "RSI": "62", "Risk": "MODERATE"},
        "bias_ok": True,
        "bias_message": "Insider-led rally -- retail at 14%, very safe entry window",
        "retail_pct": 14,
        "pattern_type": "triangle",
        "filing_found": True,
        "filing_type": "INSIDER_BUY",
        "filing_quantity": 50000,
    }
}

@router.post("/inject-signal")
async def inject_signal(request: Request, preset: str = "bullish_breakout"):
    """Demo endpoint: injects a preset signal into the WebSocket stream"""
    manager = request.app.state.manager
    template = DEMO_SIGNALS.get(preset, DEMO_SIGNALS["bullish_breakout"])
    signal = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        **template,
        "agents_triggered": ["FilingsWatcher", "ChartPatternAI", "BiasGuard", "ExplainerAgent", "Orchestrator"],
        "audit_trail": []
    }
    await manager.broadcast_signal(signal)
    return {"status": "injected", "signal_id": signal["id"]}
