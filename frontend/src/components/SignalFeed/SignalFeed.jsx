import { useStore } from '../../store'
import SignalCard from './SignalCard'
import { motion, AnimatePresence } from 'motion/react'

export default function SignalFeed() {
  const { signals, activeFilter, setFilter } = useStore()

  const filteredSignals = signals.filter(s => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'bullish') return s.sentiment === 'bullish'
    if (activeFilter === 'bearish') return s.sentiment === 'bearish'
    if (activeFilter === 'blocked') return !s.bias_ok
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Header & Filters */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500' }}>Live Signal Radar</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{signals.length} Signals Today</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <FilterBtn active={activeFilter === 'all'} onClick={() => setFilter('all')}>All Insights</FilterBtn>
          <FilterBtn active={activeFilter === 'bullish'} onClick={() => setFilter('bullish')} color="var(--bull)">Bullish</FilterBtn>
          <FilterBtn active={activeFilter === 'bearish'} onClick={() => setFilter('bearish')} color="var(--bear)">Bearish</FilterBtn>
          <FilterBtn active={activeFilter === 'blocked'} onClick={() => setFilter('blocked')} color="var(--neutral)">Bias Blocked</FilterBtn>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {signals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ width: '40px', height: '40px', border: '2px solid var(--border)', borderRadius: '50%', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p>Scanning 1,800+ NSE stocks...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <AnimatePresence>
            {filteredSignals.map(signal => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function FilterBtn({ active, onClick, color = 'var(--accent)', children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${color}15` : 'transparent',
        border: `1px solid ${active ? color : 'var(--border)'}`,
        color: active ? color : 'var(--text-secondary)',
        padding: '6px 14px',
        borderRadius: '16px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'var(--font-body)'
      }}
    >
      {children}
    </button>
  )
}
