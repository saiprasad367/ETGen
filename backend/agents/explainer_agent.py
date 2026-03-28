import os, json
from groq import Groq
from pipeline.state import SignalState
from audit.logger import AuditLogger

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

ENGLISH_PROMPT = """You are ArthDrishti's signal explainer for Indian retail investors.
Convert this trading signal data into 2-3 clear, plain English sentences.
Rules:
- Never say "buy" or "sell" -- use "signal" or "opportunity to watch"
- Include: what was detected, key number/metric, and risk level
- Be specific with numbers (price levels, percentages)
- End with the risk level: LOW / MODERATE / HIGH
Signal data: {signal_json}
Respond ONLY with the explanation text, no preamble."""

HINDI_PROMPT = """आप ArthDrishti के सिग्नल व्याख्याकार हैं। इस ट्रेडिंग सिग्नल को सरल हिंदी में 2-3 वाक्यों में समझाएं।
नियम: कभी "खरीदें" या "बेचें" न कहें -- "संकेत" या "देखने का अवसर" कहें।
Signal data: {signal_json}
केवल हिंदी में उत्तर दें।"""

def explainer_node(state: SignalState) -> SignalState:
    ticker = state["ticker"]
    AuditLogger.log_step(state["signal_id"], "explainer_agent", "STARTED", ticker)
    
    signal_summary = {
        "ticker": ticker.replace(".NS", ""),
        "company": state.get("filings_data", {}).get("company_name", ticker),
        "price": state.get("filings_data", {}).get("current_price", 0),
        "pattern": state.get("pattern_data", {}).get("type", "unknown"),
        "confidence": state.get("confidence", 0),
        "target": state.get("pattern_data", {}).get("target", 0),
        "stop_loss": state.get("pattern_data", {}).get("stop_loss", 0),
        "volume_ratio": state.get("pattern_data", {}).get("volume_ratio", 1),
        "filing_found": state.get("filings_data", {}).get("found", False),
        "filing_type": state.get("filings_data", {}).get("type"),
        "filing_qty": state.get("filings_data", {}).get("quantity", 0),
        "bias_clear": state.get("bias_ok", True),
    }
    
    try:
        # English explanation
        eng_resp = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": ENGLISH_PROMPT.format(
                signal_json=json.dumps(signal_summary)
            )}],
            max_tokens=200, temperature=0.4
        )
        english_body = eng_resp.choices[0].message.content.strip()
        
        # Hindi explanation
        hin_resp = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": HINDI_PROMPT.format(
                signal_json=json.dumps(signal_summary)
            )}],
            max_tokens=200, temperature=0.4
        )
        hindi_body = hin_resp.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Groq error: {e}")
        english_body = f"{signal_summary['company']} shows a {signal_summary['pattern']} pattern with {signal_summary['confidence']}% confidence. Volume is {signal_summary.get('volume_ratio', 1):.1f}x average. Risk: MODERATE."
        hindi_body = f"{signal_summary['company']} में {signal_summary['confidence']}% विश्वास के साथ संकेत मिला है।"
    
    state["signal_body"] = english_body
    state["signal_body_hindi"] = hindi_body
    
    AuditLogger.log_step(state["signal_id"], "explainer_agent", "COMPLETED", ticker,
                         details=f"Generated {len(english_body)} chars English + {len(hindi_body)} chars Hindi")
    return state
