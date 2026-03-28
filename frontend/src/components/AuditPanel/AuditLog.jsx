import { useStore } from '../../store'
import { motion, AnimatePresence } from 'motion/react'

export default function AuditLog() {
  const { auditLog } = useStore()

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
      <AnimatePresence>
        {auditLog.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-elevated)',
              padding: '8px 10px',
              borderRadius: '6px',
              borderLeft: `2px solid ${log.type === 'bias_block' ? 'var(--bear)' : 'var(--accent)'}`,
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
              <span style={{ color: log.type === 'bias_block' ? 'var(--bear)' : 'var(--accent)' }}>{log.ticker}</span>
            </div>
            <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {log.message}
            </div>
          </motion.div>
        ))}
        {auditLog.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '20px 0' }}>
            System online. Logging authorized actions...
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
