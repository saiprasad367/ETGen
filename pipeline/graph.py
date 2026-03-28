from langgraph.graph import StateGraph, END
from pipeline.state import SignalState
from agents.filings_watcher import filings_watcher_node
from agents.chart_pattern_ai import chart_pattern_node
from agents.bias_guard import bias_guard_node
from agents.explainer_agent import explainer_node
from agents.orchestrator import orchestrator_node
from audit.logger import AuditLogger
import uuid
from datetime import datetime

def should_deliver(state: SignalState) -> str:
    """Conditional edge: only deliver if bias check passed AND confidence > 70"""
    if state.get("bias_ok") and state.get("confidence", 0) > 70:
        return "explainer"
    return "audit_only"

def audit_only_node(state: SignalState) -> SignalState:
    """Log bias-blocked signals without delivery"""
    AuditLogger.log({
        "signal_id": state.get("signal_id"),
        "ticker": state.get("ticker"),
        "agent": "bias_guard",
        "decision": "BLOCKED",
        "reason": state.get("bias_message"),
        "timestamp": datetime.now().isoformat()
    })
    state["delivered"] = False
    return state

def build_graph():
    g = StateGraph(SignalState)
    g.add_node("filings_watcher", filings_watcher_node)
    g.add_node("chart_pattern", chart_pattern_node)
    g.add_node("bias_guard", bias_guard_node)
    g.add_node("explainer", explainer_node)
    g.add_node("orchestrator", orchestrator_node)
    g.add_node("audit_only", audit_only_node)

    g.set_entry_point("filings_watcher")
    g.add_edge("filings_watcher", "chart_pattern")
    g.add_edge("chart_pattern", "bias_guard")
    g.add_conditional_edges("bias_guard", should_deliver, {
        "explainer": "explainer",
        "audit_only": "audit_only"
    })
    g.add_edge("explainer", "orchestrator")
    g.add_edge("orchestrator", END)
    g.add_edge("audit_only", END)

    return g.compile()

_graph = build_graph()

def run_pipeline(ticker: str) -> dict:
    initial_state = SignalState(
        ticker=ticker,
        signal_id=str(uuid.uuid4()),
        timestamp=datetime.now().isoformat(),
        filings_data=None,
        pattern_data=None,
        bias_ok=True,
        bias_message="",
        bias_warnings=[],
        retail_pct=0,
        confidence=0,
        signal_body="",
        signal_body_hindi="",
        delivered=False,
        signal=None,
        audit_trail=[]
    )
    result = _graph.invoke(initial_state)
    return result
