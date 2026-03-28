import { useStore } from '../../store'
import LiveTicker from './LiveTicker'
import { motion } from 'motion/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Header() {
  const { showHindi, toggleHindi } = useStore()
  const DEMO_MODE = false // Hardcode for demo

  const injectSignal = async (preset) => {
    try {
      await axios.post(`${API}/api/demo/inject-signal?preset=${preset}`)
      toast.success(`Injected demo signal: ${preset}`)
    } catch (e) {
      toast.error('Failed to inject signal')
    }
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: '24px', letterSpacing: '1px' }}>
            ArthDrishti
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            AI Signal Intelligence
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bull)', boxShadow: '0 0 8px var(--bull)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>LIVE PIPELINE</span>
        </div>
      </div>

      <div style={{ flex: 1, margin: '0 40px' }}>
        <LiveTicker />
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {DEMO_MODE && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => injectSignal('bullish_breakout')} style={btnStyle}>Demo: Bullish</button>
            <button onClick={() => injectSignal('bias_warning')} style={{ ...btnStyle, borderColor: 'var(--bear)' }}>Demo: Bias Block</button>
            <button onClick={() => injectSignal('insider_buy')} style={btnStyle}>Demo: Insider</button>
          </div>
        )}

        <button 
          onClick={toggleHindi}
          style={{
            ...btnStyle,
            background: showHindi ? 'var(--accent-dim)' : 'transparent',
            borderColor: showHindi ? 'var(--accent)' : 'var(--border)'
          }}
        >
          {showHindi ? 'हिंदी' : 'EN'}
        </button>
      </div>
    </motion.header>
  )
}

const btnStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontFamily: 'var(--font-body)',
  transition: 'all 0.2s',
}
