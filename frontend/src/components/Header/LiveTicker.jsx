import { useStore } from '../../store'

export default function LiveTicker() {
  const { marketData } = useStore()
  
  if (!marketData || Object.keys(marketData).length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading market data...</div>
  }

  const items = [
    { label: 'NIFTY 50', key: 'nifty50' },
    { label: 'SENSEX', key: 'sensex' },
    { label: 'BANK NIFTY', key: 'bank_nifty' },
    { label: 'INDIA VIX', key: 'vix' },
  ]

  return (
    <div style={{ display: 'flex', gap: '24px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {items.map(item => {
        const data = marketData[item.key]
        if (!data) return null
        
        const isUp = data.change_pct >= 0
        const color = isUp ? 'var(--bull)' : 'var(--bear)'
        const icon = isUp ? '▲' : '▼'
        
        return (
          <div key={item.key} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500' }}>{item.label}</span>
            <span className="price-number" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{data.value.toLocaleString()}</span>
            <span style={{ color, fontSize: '12px', fontWeight: '600' }}>
              {icon} {Math.abs(data.change_pct).toFixed(2)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
