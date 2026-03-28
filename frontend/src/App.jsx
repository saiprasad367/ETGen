import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header/Header'
import AgentPanel from './components/AgentPanel/AgentPanel'
import SignalFeed from './components/SignalFeed/SignalFeed'
import AuditPanel from './components/AuditPanel/AuditPanel'
import { useSignalSocket } from './hooks/useSignalSocket'
import { useAgentSocket } from './hooks/useAgentSocket'
import { useStore } from './store'
import axios from 'axios'
import './theme.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  useSignalSocket()
  useAgentSocket()
  
  const { setMarketData, activeTab } = useStore()

  // Poll market data every 10s
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const { data } = await axios.get(`${API}/api/ticker`)
        setMarketData(data)
      } catch (e) {}
    }
    fetchTicker()
    const interval = setInterval(fetchTicker, 10000)
    return () => clearInterval(interval)
  }, [setMarketData])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', flex: 1, overflow: 'hidden' }}>
        <AgentPanel />
        <SignalFeed />
        <AuditPanel />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#041527',
            color: '#e8f4fd',
            border: '1px solid rgba(0,212,255,0.35)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px',
          }
        }}
      />
    </div>
  )
}
