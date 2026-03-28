from typing import List, Dict, Optional, TypedDict
from datetime import datetime

class AgentLog(TypedDict):
    agent_name: str
    input: str
    output: str
    timestamp: str

class SignalEvent(TypedDict):
    # Core identifying info
    stock_symbol: str
    event_type: str # 'FILING', 'PATTERN', 'SITUATION'
    
    # FilingsWatcher Output
    filing_details: Optional[Dict]
    magnitude_vs_baseline: float
    
    # ChartPatternAI Output
    pattern_name: Optional[str]
    pattern_confidence: float
    support_level: float
    resistance_level: float
    backtest_winrate: float
    
    # BiasGuard Output
    bias_rating: str # 'SAFE', 'CAUTION', 'CROWDED'
    retail_saturation: float
    bias_reason: str
    
    # ExplainerAgent Output
    alert_text_en: str
    alert_text_hi: str
    risk_score: int # 1-10
    
    # Metadata
    timestamp: str
    audit_trail: List[AgentLog]
