import React from 'react';
import { Terminal, Clock, Box } from 'lucide-react';

const AuditLog = ({ logs }) => {
  return (
    <div className="bg-[#101012] border border-white/5 rounded-xl p-6 h-full flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Terminal className="w-5 h-5 text-accent-primary" />
        <h3 className="font-semibold text-sm uppercase tracking-widest text-secondary">Agent Audit Trail</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        {logs && logs.map((log, index) => (
          <div key={index} className="relative pl-6 border-l border-white/10 group">
            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-accent-primary/50 group-hover:bg-accent-primary transition-colors" />
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold text-accent-secondary uppercase">{log.agent_name}</span>
              <span className="text-[9px] text-secondary/50 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="bg-white/[0.02] rounded p-2 text-[11px] font-mono text-secondary">
                <span className="text-white/40">IN:</span> {log.input}
              </div>
              <div className="p-1 px-2 text-[12px] leading-snug">
                <span className="text-accent-primary/60 font-bold mr-1">OUT:</span> {log.output}
              </div>
            </div>
          </div>
        ))}
        {(!logs || logs.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-secondary/30 gap-2">
            <Box className="w-8 h-8" />
            <p className="text-xs italic underline-offset-4 decoration-dotted underline">Awaiting signal generation sequence...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
