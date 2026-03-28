import { motion } from 'motion/react'
import CandlestickChart from '../Charts/CandlestickChart'
import RadarChart from './RadarChart'

export default function SignalExpanded({ signal, onClose, borderColor }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2, 11, 24, 0.8)', backdropFilter: 'blur(8px)' }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <div>
               <h2 style={{ margin: 0 }}>{signal.ticker} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>{signal.company_name}</span></h2>
               <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {signal.agents_triggered.map(a => (
                      <span key={a} style={{ fontSize: '11px', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '12px', color: 'var(--accent)' }}>{a}</span>
                  ))}
               </div>
            </div>
            
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', flex: 1, overflow: 'hidden' }}>
            <div style={{ borderRight: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Interactive Pattern Analysis</h3>
                <div style={{ flex: 1, minHeight: '400px' }}>
                    <CandlestickChart data={signal.ohlcv} pattern={signal.pattern_type} target={signal.target} stop={signal.stop_loss} entry={signal.price} />
                </div>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>5-Axis Intelligence Profile</h3>
                <div style={{ height: '300px' }}>
                    <RadarChart signal={signal} />
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Audit Trail & Execution</h3>
                    <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        <p>{signal.signal_body}</p>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
