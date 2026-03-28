import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '../../store'
import MiniCandle from './MiniCandle'
import SignalExpanded from './SignalExpanded'

export default function SignalCard({ signal }) {
  const [expanded, setExpanded] = useState(false)
  const { showHindi } = useStore()
  
  const isBlocked = !signal.bias_ok
  let borderColor = 'var(--neutral)'
  let glowColor = 'transparent'
  
  if (!isBlocked) {
    borderColor = signal.sentiment === 'bullish' ? 'var(--bull)' : 'var(--bear)'
    glowColor = signal.sentiment === 'bullish' ? 'var(--bull-glow)' : 'var(--bear-glow)'
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        onClick={() => setExpanded(true)}
        style={{
          background: 'var(--bg-surface)',
          borderRadius: '8px',
          borderLeft: `3px solid ${borderColor}`,
          borderTop: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '20px',
          cursor: 'pointer',
          boxShadow: `0 4px 20px ${glowColor}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
        whileHover={{ scale: 1.01, background: 'var(--bg-elevated)' }}
      >
        {isBlocked && (
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--bear-dim)', color: 'var(--bear)', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', borderBottomLeftRadius: '8px' }}>
            BIAS BLOCKED
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontSize: '20px', margin: 0 }}>{signal.ticker}</h3>
              <div style={{ fontSize: '16px', color: 'var(--text-number)', fontFamily: 'var(--font-mono)' }}>₹{signal.price}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {signal.company_name} • {signal.sector}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             {/* Circular Confidence Meter */}
             <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke={borderColor} strokeWidth="3" 
                          strokeDasharray="100" strokeDashoffset={100 - signal.confidence} 
                          transform="rotate(-90 18 18)" />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600' }}>
                  {signal.confidence}
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Body */}
        <div style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-primary)', fontFamily: showHindi ? 'var(--font-hindi)' : 'var(--font-body)' }}>
          {isBlocked ? (
             <span style={{ color: 'var(--bear)' }}>{signal.bias_message}</span>
          ) : (
             showHindi ? signal.signal_body_hindi : signal.signal_body
          )}
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: 'var(--bg-base)', padding: '12px', borderRadius: '6px' }}>
            <Metric label="Breakout" value={signal.metrics.Breakout} />
            <Metric label="Target" value={signal.metrics.Target} />
            <Metric label="Hit Rate" value={signal.metrics['Pattern Hit Rate']} />
            <Metric label="Volume" value={signal.metrics.Volume} />
        </div>

      </motion.div>

      <AnimatePresence>
        {expanded && <SignalExpanded signal={signal} onClose={() => setExpanded(false)} borderColor={borderColor} />}
      </AnimatePresence>
    </>
  )
}

function Metric({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-number)' }}>{value}</span>
    </div>
  )
}
