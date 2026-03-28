import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Signals
  signals: [],
  activeFilter: 'all',
  activeTab: 'signals',
  addSignal: (sig) => set(state => ({
    signals: [sig, ...state.signals].slice(0, 50) // keep last 50
  })),
  setFilter: (f) => set({ activeFilter: f }),
  setTab: (t) => set({ activeTab: t }),

  // Agent status
  agents: {
    filings_watcher: { status: 'active', ticker: null, metrics: { filings: 47, alerts: 12 }},
    chart_pattern_ai: { status: 'scanning', metrics: { stocks: 1847, patterns: 8 }},
    bias_guard: { status: 'active', metrics: { warnings: 3, crowd_pct: 24 }},
    explainer_agent: { status: 'standby', metrics: { generated: 19, latency: '1.2s' }},
    delivery_orchestrator: { status: 'idle', metrics: { delivered: 19, users: 1240 }},
  },
  updateAgent: (name, data) => set(state => ({
    agents: { ...state.agents, [name]: { ...state.agents[name], ...data }}
  })),

  // Stats
  stats: { signals: 24, accuracy: 71, bias_blocks: 3, active_users: 1240, losses_prevented: 0 },
  updateStats: (s) => set(state => ({ stats: { ...state.stats, ...s }})),

  // Audit log
  auditLog: [],
  addAudit: (entry) => set(state => ({ auditLog: [entry, ...state.auditLog].slice(0, 100) })),

  // User risk profile
  riskProfile: null,
  setRiskProfile: (p) => set({ riskProfile: p }),

  // Market data
  marketData: {},
  setMarketData: (d) => set({ marketData: d }),

  // Portfolio
  portfolio: [],
  setPortfolio: (p) => set({ portfolio: p }),

  // Hindi toggle
  showHindi: false,
  toggleHindi: () => set(state => ({ showHindi: !state.showHindi })),
}))
