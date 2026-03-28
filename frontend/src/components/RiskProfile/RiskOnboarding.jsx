import { useState } from 'react'
import { useStore } from '../../store'
import { motion, AnimatePresence } from 'motion/react'

export default function RiskOnboarding() {
  const { riskProfile, setRiskProfile } = useStore()
  const [step, setStep] = useState(0)
  
  const questions = [
    { q: 'What is your primary goal?', options: ['Capital Preservation', 'Steady Income', 'Balanced Growth', 'Aggressive Returns'] },
    { q: 'Investment horizon?', options: ['< 1 Year', '1 - 3 Years', '3 - 7 Years', '7+ Years'] },
    { q: 'Max acceptable loss?', options: ['< 5%', '5 - 15%', '15 - 25%', '> 25%'] }
  ]

  const handleSelect = (idx) => {
    if (step < questions.length - 1) {
      setStep(s => s + 1)
    } else {
      // Mock calculation based on random simple logic
      const profiles = ['Conservative', 'Moderate', 'Aggressive', 'Trader']
      setRiskProfile(profiles[Math.floor(Math.random() * profiles.length)])
    }
  }

  if (riskProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--accent-dim)' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Profile</div>
          <div style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: '600' }}>{riskProfile}</div>
        </div>
        <button onClick={() => { setRiskProfile(null); setStep(0) }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Change</button>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '2px', background: i <= step ? 'var(--accent)' : 'var(--grid-line-strong)' }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h4 style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '12px' }}>{questions[step]?.q}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {questions[step]?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
