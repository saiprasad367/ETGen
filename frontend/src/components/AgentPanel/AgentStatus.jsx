import React from 'react';
import useStore from '../../store';
import { motion, AnimatePresence } from 'motion/react';

const AgentStatusCard = ({ name, data }) => {
  const isActive = data?.status === 'processing';
  const isDelivered = data?.status === 'delivered';
  
  return (
    <div className={`p-3 rounded border transition-all ${
      isActive ? 'border-cyan bg-cyan/10 shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 
      isDelivered ? 'border-green/50 bg-green/5' : 'border-border bg-bg3/30'
    }`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-cyan' : 'text-text3'}`}>
          {name.replace('_', ' ')}
        </span>
        {isActive && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_5px_#00f2ff]"
          />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-mono truncate">{data?.ticker || '---'}</span>
        <span className={`text-[9px] uppercase font-bold mt-1 ${isDelivered ? 'text-green' : 'text-text3'}`}>
          {data?.status || 'Idle'}
        </span>
      </div>
    </div>
  );
};

const AgentPanel = () => {
  const { agentStatus } = useStore();
  
  const agents = [
    'filings_watcher',
    'chart_pattern_ai',
    'bias_guard',
    'explainer_agent',
    'delivery_orchestrator'
  ];

  return (
    <div className="glass p-4 flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-widest text-cyan mb-1 font-bold">Autonomous Agents</h3>
      <div className="flex flex-col gap-2">
        {agents.map(agent => (
          <AgentStatusCard key={agent} name={agent} data={agentStatus[agent]} />
        ))}
      </div>
    </div>
  );
};

export default AgentPanel;
