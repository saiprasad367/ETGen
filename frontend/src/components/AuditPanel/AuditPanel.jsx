import { useStore } from '../../store'
import StatsGrid from './StatsGrid'
import AuditLog from './AuditLog'
import PortfolioImpact from '../Charts/PortfolioImpact'
import RiskOnboarding from '../RiskProfile/RiskOnboarding'

export default function AuditPanel() {
  const { riskProfile } = useStore()

  return (
    <div style={{ 
      background: 'var(--bg-surface)', 
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Risk Profile Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          Investor Intelligence
        </h2>
        <RiskOnboarding />
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <StatsGrid />
      </div>

      {/* Portfolio Impact Simulator */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Portfolio Impact (Last 5)</span>
          <span style={{ color: 'var(--bull)' }}>+₹8,600</span>
        </h3>
        <PortfolioImpact />
      </div>

      {/* Live Audit Log */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          SEBI Compliance Audit Trail
        </h3>
        <AuditLog />
      </div>
    </div>
  )
}
