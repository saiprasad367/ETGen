import { useEffect, useRef } from 'react'
import { useStore } from '../store'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

export function useAgentSocket() {
  const { updateAgent } = useStore()
  const ws = useRef(null)
  const reconnect = useRef(null)

  const connect = () => {
    ws.current = new WebSocket(`${WS_URL}/ws/agents`)

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.agent) {
          updateAgent(data.agent, data)
      }
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
