import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'motion/react';
import { useStore } from '../store';
import { Shield, BarChart2, Users, CheckCircle, Zap } from 'lucide-react';

const StatCard = ({ label, value, sub, Icon }) => (
    <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            <Icon size={12} className="text-teal-500" />
        </div>
        <div className="text-xl font-bold mono text-slate-100">{value}</div>
        <div className="text-[9px] text-slate-600 font-medium mt-1">{sub}</div>
    </div>
);

const AuditPanel = () => {
  const { auditLog } = useStore();
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    const controls = animate(0, 750, {
      duration: 2,
      onUpdate: (value) => setLosses(Math.round(value)),
    });
    return () => controls.stop();
  }, []);

  return (
    <aside className="w-[320px] border-l border-[#1e2d42] flex flex-col gap-6 p-5 overflow-y-auto bg-[#070a0f]/50">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Signals Today" value="142" sub="+12% from avg" Icon={Zap} />
        <StatCard label="Accuracy %" value="94.2" sub="Last 24h" Icon={BarChart2} />
        <StatCard label="Bias Blocks" value="38" sub="FOMO prevented" Icon={Shield} />
        <StatCard label="Live Streams" value="1,204" sub="Active users" Icon={Users} />
      </div>

      <div className="p-5 glass rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4a6285] mb-1">Losses Prevented</h4>
            <div className="text-3xl font-bold mono text-teal-400">₹{losses} Cr</div>
            <p className="text-[9px] text-[#8ba3c7] mt-2 leading-tight">ArthDrishti has successfully steered retail investors away from {losses/10}k+ potential pump-and-dump scenarios.</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield size={64} className="text-teal-500" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4a6285]">Impact Metrics</h4>
        {[
            { label: 'Signal Coverage', val: 88, color: 'bg-blue-500' },
            { label: 'Bias Prevention', val: 92, color: 'bg-purple-500' },
            { label: 'Retail Adoption', val: 76, color: 'bg-teal-500' }
        ].map(item => (
            <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-tighter">{item.label}</span>
                    <span className="mono text-slate-100">{item.val}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${item.color}`}
                    />
                </div>
            </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4a6285] flex items-center gap-2">
            <CheckCircle size={12} className="text-green-500" /> Immutable Audit Log
        </h4>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {auditLog.length > 0 ? auditLog.map(entry => (
                <div key={entry.id} className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-lg flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold mono text-teal-500 uppercase">{entry.type}</span>
                        <span className="text-[8px] mono text-slate-600">{entry.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium leading-tight">{entry.message}</p>
                </div>
            )) : (
                <div className="text-center py-8 text-[10px] text-slate-600 italic">No audit entries yet...</div>
            )}
        </div>
      </div>
    </aside>
  );
};

export default AuditPanel;
