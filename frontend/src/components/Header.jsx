import React, { useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { motion } from 'motion/react';

const Header = () => {
  const { marketData, setMarketData } = useStore();

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const resp = await axios.get('http://localhost:8000/api/ticker');
        setMarketData(resp.data);
      } catch (err) {
        console.error("Ticker fetch error", err);
      }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, [setMarketData]);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-bg2/50 backdrop-blur-md relative z-50">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tighter text-cyan skew-x-[-10deg]">
            ARTH<span className="text-white">DRISHTI</span>
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-text3 -mt-1">Autonomous AI Terminus</span>
        </div>

        <div className="flex items-center gap-6 border-l border-border pl-6 h-8">
          {Object.entries(marketData).map(([name, data]) => (
            <div key={name} className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-text3 leading-none mb-0.5">{name.replace('_', ' ')}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold mono">₹{data.value.toLocaleString()}</span>
                <span className={`text-[10px] font-bold mono ${data.change_pct >= 0 ? 'text-green' : 'text-red'}`}>
                  {data.change_pct >= 0 ? '▲' : '▼'} {Math.abs(data.change_pct)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search NSE Ticker..." 
            className="bg-bg/50 border border-border px-4 py-2 pl-10 rounded text-xs w-[240px] focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-all font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                axios.post(`http://localhost:8000/api/generate?ticker=${e.target.value}.NS`);
                e.target.value = '';
              }
            }}
          />
          <svg className="absolute left-3 top-2.5 text-text3 group-hover:text-cyan transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div className="h-8 w-8 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
