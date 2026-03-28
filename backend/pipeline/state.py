from typing import TypedDict, Optional, Any

class SignalState(TypedDict):
    ticker: str
    signal_id: str
    timestamp: str
    filings_data: Optional[dict]
    pattern_data: Optional[dict]
    bias_ok: bool
    bias_message: str
    bias_warnings: list
    retail_pct: int
    confidence: int
    signal_body: str
    signal_body_hindi: str
    delivered: bool
    signal: Optional[dict]
    audit_trail: list
