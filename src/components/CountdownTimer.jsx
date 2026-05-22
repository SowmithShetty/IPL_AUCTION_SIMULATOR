import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * CountdownTimer — Circular countdown ring that creates real auction urgency.
 * Green → Yellow → Red as time expires.
 * Shows "Going once... Going twice..." text.
 */
export default function CountdownTimer({ isActive, duration = 6, onExpire, onGoingOnce, onGoingTwice }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState('idle'); // idle, counting, going_once, going_twice
  const intervalRef = useRef(null);
  const hasCalledOnce = useRef(false);
  const hasCalledTwice = useRef(false);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
      setPhase('counting');
      hasCalledOnce.current = false;
      hasCalledTwice.current = false;

      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const next = +(prev - 0.1).toFixed(1);
          if (next <= 0) {
            clearInterval(intervalRef.current);
            setPhase('idle');
            if (onExpire) onExpire();
            return 0;
          }
          return next;
        });
      }, 100);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
      setTimeLeft(duration);
      setPhase('idle');
      hasCalledOnce.current = false;
      hasCalledTwice.current = false;
    }
  }, [isActive, duration]);

  // Phase transitions
  useEffect(() => {
    if (!isActive) return;
    const threshold1 = duration * 0.6; // ~3.6s for 6s timer
    const threshold2 = duration * 0.3; // ~1.8s for 6s timer

    if (timeLeft <= threshold2 && timeLeft > 0 && !hasCalledTwice.current) {
      setPhase('going_twice');
      hasCalledTwice.current = true;
      if (onGoingTwice) onGoingTwice();
    } else if (timeLeft <= threshold1 && timeLeft > threshold2 && !hasCalledOnce.current) {
      setPhase('going_once');
      hasCalledOnce.current = true;
      if (onGoingOnce) onGoingOnce();
    }
  }, [timeLeft, isActive]);

  if (!isActive && phase === 'idle') return null;

  const progress = timeLeft / duration;
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference * (1 - progress);

  // Color based on time remaining
  let ringColor = '#10b981'; // green
  let textColor = 'text-emerald-400';
  let bgGlow = 'shadow-[0_0_20px_rgba(16,185,129,0.2)]';
  if (progress < 0.3) {
    ringColor = '#ef4444'; // red
    textColor = 'text-rose-400';
    bgGlow = 'shadow-[0_0_25px_rgba(239,68,68,0.3)]';
  } else if (progress < 0.6) {
    ringColor = '#f59e0b'; // amber
    textColor = 'text-amber-400';
    bgGlow = 'shadow-[0_0_20px_rgba(245,158,11,0.25)]';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex flex-col items-center gap-2 ${bgGlow} rounded-full p-1`}
    >
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        {/* Background ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle
            cx="40" cy="40" r="38"
            fill="none"
            stroke={ringColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-100"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg md:text-xl font-black italic tabular-nums ${textColor}`}>
            {Math.ceil(timeLeft)}
          </span>
        </div>
      </div>

      {/* Phase text */}
      {phase === 'going_once' && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400"
        >
          Going Once...
        </motion.span>
      )}
      {phase === 'going_twice' && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400"
        >
          Going Twice!
        </motion.span>
      )}
    </motion.div>
  );
}
