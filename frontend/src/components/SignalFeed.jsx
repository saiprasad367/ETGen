import React from 'react';
import useStore from '../store';
import SignalCard from './SignalCard';
import { motion, AnimatePresence } from 'motion/react';

const SignalFeed = () => {
  const { signals } = useStore();

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full pr-2 pb-8 scroll-smooth">
      <AnimatePresence initial={false}>
        {signals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text3 opacity-50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
            <p className="text-sm uppercase tracking-widest">Waiting for live data...</p>
            <p className="text-[10px] mt-2">The AI is currently scanning {['TATAPWR', 'RELIANCE', 'INFY'].join(', ')}</p>
          </div>
        ) : (
          signals.map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <SignalCard signal={signal} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignalFeed;
