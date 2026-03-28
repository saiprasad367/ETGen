import { useStore } from '../../store'
import PipelineFlow from './PipelineFlow'

export default function AgentPanel() {
  const { agents } = useStore()
  
  return (
    <div style={{ 
      background: 'var(--bg-surface)', 
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Agent Pipeline
        </h2>
      </div>
      
      <div style={{ flex: 1, padding: '20px' }}>
        <PipelineFlow agents={agents} />
      </div>
    </div>
  )
}
