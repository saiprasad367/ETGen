import React, { useState } from 'react';
import { motion } from 'motion/react';

const SignalCard = ({ signal }) => {
  const [lang, setLang] = useState('en');
  const isBullish = signal.sentiment === 'bullish';
  
  return (
    <div className={`glass p-5 border-l-4 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
      isBullish ? 'border-l-green' : signal.sentiment === 'bearish' ? 'border-l-red' : 'border-l-amber'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold tracking-tight text-white">{signal.ticker}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
              isBullish ? 'bg-green/20 text-green' : 'bg-red/20 text-red'
            }`}>
              {signal.sentiment}
            </span>
            <span className="px-2 py-0.5 rounded bg-bg3 text-text3 text-[10px] font-mono">
              CONF: {signal.confidence}%
            </span>
          </div>
          <p className="text-xs text-text3 font-medium">{signal.company_name} • {signal.sector}</p>
        </div>
        
        <div className="flex gap-1">
          <button onClick={() => setLang('en')} className={`text-[10px] px-2 py-0.5 rounded ${lang === 'en' ? 'bg-cyan text-bg font-bold' : 'bg-bg3 text-text3'}`}>EN</button>
          <button onClick={() => setLang('hi')} className={`text-[10px] px-2 py-0.5 rounded ${lang === 'hi' ? 'bg-cyan text-bg font-bold' : 'bg-bg3 text-text3'}`}>हि</button>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-text2 mb-4">
        {lang === 'en' ? signal.signal_body : (signal.signal_body_hindi || "हिंदी व्याख्या उपलब्ध नहीं है।")}
      </p>

      <div className="grid grid-cols-4 gap-3 bg-bg/40 p-3 rounded-lg border border-border/50">
        {Object.entries(signal.metrics || {}).map(([label, val]) => (
          <div key={label} className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-text3 mb-0.5">{label}</span>
            <span className={`text-xs font-bold mono ${
              val.includes('LOW') || val.includes('₹') || val.includes('%') ? 'text-white' : 'text-cyan'
            }`}>{val}</span>
          </div>
        ))}
      </div>

      {!signal.bias_ok && (
        <div className="mt-4 p-2 bg-red/10 border border-red/30 rounded flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4d6d" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span className="text-[10px] font-bold text-red uppercase tracking-tight">{signal.bias_message}</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {signal.agents_triggered?.map(agent => (
          <span key={agent} className="text-[9px] uppercase font-bold text-cyan/60">
            {agent} →
          </span>
        ))}
        <span className="text-[9px] uppercase font-bold text-green">DELIVERED</span>
      </div>
    </div>
  );
};

export default SignalCard;
