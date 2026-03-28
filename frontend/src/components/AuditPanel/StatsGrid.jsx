import { useStore } from '../../store'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export default function StatsGrid() {
  const { stats } = useStore()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <StatCard label="Accuracy" value={`${stats.accuracy}%`} color="var(--bull)" />
      <StatCard label="Bias Blocks" value={stats.bias_blocks} color="var(--bear)" />
      <StatCard label="Active Users" value={(stats.active_users / 1000).toFixed(1) + 'k'} color="var(--accent)" />
      <StatCard label="Losses Prevented" value={`₹${(stats.losses_prevented || 750)}Cr`} color="var(--gold)" />
    </div>
  )
}

function StatCard({ label, value, color }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        padding: '12px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', color: color || 'var(--text-primary)', textShadow: `0 0 12px ${color}40` }}>
        {displayValue}
      </span>
    </motion.div>
  )
}
