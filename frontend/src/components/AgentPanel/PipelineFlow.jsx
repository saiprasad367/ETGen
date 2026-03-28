import { motion } from 'motion/react'

export default function PipelineFlow({ agents }) {
  const nodes = [
    { id: 'filings_watcher', name: 'FilingsWatcher', desc: 'XBRL Bulk Deals' },
    { id: 'chart_pattern_ai', name: 'ChartPatternAI', desc: 'Technical Patterns' },
    { id: 'bias_guard', name: 'BiasGuard', desc: 'Behavioral Screener' },
    { id: 'explainer_agent', name: 'ExplainerAgent', desc: 'Llama 3.3 70B' },
    { id: 'delivery_orchestrator', name: 'Orchestrator', desc: 'Risk & Routing' },
  ]
  
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '30px', paddingLeft: '10px' }}>
      {/* Connecting animated line */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '20px',
        bottom: '20px',
        width: '2px',
        background: 'var(--grid-line-strong)',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)',
          animation: 'particleSlide 3s infinite linear'
        }} />
      </div>

      <style>{`
        @keyframes particleSlide {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {nodes.map((node, i) => {
        const agentState = agents[node.id] || { status: 'idle' }
        const isActive = agentState.status === 'processing'
        const isCompleted = agentState.status === 'completed' || agentState.status === 'delivered'
        
        let nodeColor = 'var(--text-muted)'
        let glow = 'none'
        
        if (isActive) {
          nodeColor = 'var(--accent)'
          glow = '0 0 12px var(--accent-glow)'
        } else if (isCompleted) {
          nodeColor = 'var(--bull)'
        }

        return (
          <div key={node.id} style={{ display: 'flex', gap: '16px', zIndex: 1, position: 'relative' }}>
            <div style={{
              width: '22px', height: '22px', 
              borderRadius: '50%',
              background: 'var(--bg-base)',
              border: `2px solid ${nodeColor}`,
              boxShadow: glow,
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: nodeColor }} />}
            </div>
            
            <div style={{ flex: 1, opacity: isActive || isCompleted ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {node.name}
                </span>
                {agentState.ticker && isActive && (
                  <span style={{ fontSize: '10px', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 6px', borderRadius: '4px' }}>
                    {agentState.ticker}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {node.desc}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
