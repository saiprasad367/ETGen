import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { ShieldCheck, TrendingUp, Search, MessageSquare, Send } from 'lucide-react';

const icons = {
  "FilingsWatcher": Search,
  "ChartPatternAI": TrendingUp,
  "BiasGuard": ShieldCheck,
  "ExplainerAgent": MessageSquare,
  "Orchestrator": Send
};

const AgentPanel = () => {
  const { agents } = useStore();

  return (
    <aside className="w-[280px] border-r border-[#1e2d42] flex flex-col gap-4 p-4 overflow-y-auto bg-[#070a0f]/50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a6285]">Multi-Agent Pipeline</h3>
        <span className="text-[10px] bg-teal-500/10 text-teal-500 px-2 py-0.5 rounded border border-teal-500/20">5 Agents</span>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(agents).map(([name, data]) => {
          const Icon = icons[name] || Activity;
          const isActive = data.status === 'ACTIVE' || data.status === 'PROCESSING';
          
          return (
            <motion.div
              key={name}
              layout
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isActive ? 'bg-[#111720] border-teal-500/50 shadow-lg shadow-teal-500/5' : 'bg-transparent border-[#1e2d42] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold">{name.replace('Watcher', '').replace('AI', '').replace('Guard', '').replace('Agent', '')}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={data.status}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                        data.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-500' : 
                        data.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 
                        'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {data.status}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(data.metrics).map(([mName, mVal]) => (
                  <div key={mName} className="flex flex-col">
                    <span className="text-[8px] text-[#4a6285] uppercase font-bold">{mName}</span>
                    <span className="text-[10px] mono font-bold truncate">{mVal}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-auto pt-4 border-t border-[#1e2d42]">
        <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/50">
          <p className="text-[10px] text-[#4a6285] leading-relaxed italic">
            "Watching NSE/BSE corporate filings and institutional flow in real-time."
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AgentPanel;
