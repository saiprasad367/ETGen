from langgraph.graph import StateGraph, END
from pipeline.state import SignalState
from agents.filings_watcher import filings_watcher
from agents.chart_pattern_ai import chart_pattern_ai
from agents.bias_guard import bias_guard
from agents.explainer_agent import explainer_agent
from agents.orchestrator import orchestrator

def create_arthdrishti_graph():
    workflow = StateGraph(SignalState)

    # 1. Add Nodes
    workflow.add_node("filings_watcher", filings_watcher.process)
    workflow.add_node("chart_pattern_ai", chart_pattern_ai.process)
    workflow.add_node("bias_guard", bias_guard.process)
    workflow.add_node("explainer_agent", explainer_agent.process)
    workflow.add_node("orchestrator", orchestrator.process)

    # 2. Define Entry Point
    workflow.set_entry_point("filings_watcher")

    # 3. Define Main Flow
    workflow.add_edge("filings_watcher", "chart_pattern_ai")
    workflow.add_edge("chart_pattern_ai", "bias_guard")

    # 4. Conditional Edge: Only explain and deliver if BiasGuard says OK
    def bias_routing(state: SignalState):
        if state.get("bias_ok", True):
            return "explainer_agent"
        else:
            return "orchestrator" # Skip explanation/delivery, proceed straight to final audit log

    workflow.add_conditional_edges(
        "bias_guard",
        bias_routing,
        {
            "explainer_agent": "explainer_agent",
            "orchestrator": "orchestrator"
        }
    )

    workflow.add_edge("explainer_agent", "orchestrator")
    workflow.add_edge("orchestrator", END)

    return workflow.compile()
