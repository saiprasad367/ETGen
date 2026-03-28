from pydantic import BaseModel
from typing import List, Dict, Optional

class SignalEvent(BaseModel):
    id: str
    ticker: str
    company_name: str
    sector: str
    price: float
    change_pct: float
    sentiment: str
    confidence: int
    agents_triggered: List[str]
    signal_body: str
    signal_body_hindi: Optional[str] = ""
    metrics: Dict[str, str]
    bias_ok: bool
    bias_message: str
    retail_pct: int
    pattern_type: str
    pattern_points: List[float]
    ohlcv: Optional[Dict[str, List]] = None
    target: float
    stop_loss: float
    hit_rate: int
    filing_found: bool
    filing_type: Optional[str] = None
    filing_quantity: int
    timestamp: str
    audit_trail: List[dict]

class AgentStatus(BaseModel):
    agent: str
    status: str
    ticker: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None
