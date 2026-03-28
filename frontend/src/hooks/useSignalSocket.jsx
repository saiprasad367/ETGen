import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import toast from 'react-hot-toast'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

export function useSignalSocket() {
  const { addSignal, addAudit, updateStats } = useStore()
  const ws = useRef(null)
  const reconnect = useRef(null)

  const connect = () => {
    ws.current = new WebSocket(`${WS_URL}/ws/signals`)

    ws.current.onmessage = (e) => {
      const signal = JSON.parse(e.data)
      addSignal(signal)
      addAudit({
        type: signal.bias_ok ? 'signal' : 'bias_block',
        ticker: signal.ticker,
        message: signal.bias_ok
          ? `Signal generated for ${signal.ticker} -- ${signal.confidence}% confidence`
          : `BiasGuard BLOCKED ${signal.ticker} -- ${signal.bias_message}`,
        timestamp: signal.timestamp
      })
      // Toast notification
      toast.custom(() => (
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: '600', color: signal.bias_ok ? '#00e5a0' : '#ff3d5a' }}>
                 {signal.ticker} -- {signal.bias_ok ? 'NEW SIGNAL' : 'BLOCKED'}
            </span>
            <span style={{ fontSize: '11px', color: '#7ea8c9' }}>
                {signal.bias_ok ? `${signal.confidence}% confidence | Risk: ${signal.metrics?.Risk}` : signal.bias_message}
            </span>
        </div>
      ), { duration: 5000 })
    }

    ws.current.onclose = () => {
      reconnect.current = setTimeout(connect, 3000)
    }

    ws.current.onerror = () => {
      ws.current?.close()
    }
  }

  useEffect(() => {
    connect()
    return () => {
      ws.current?.close()
      clearTimeout(reconnect.current)
    }
  }, [])
}
