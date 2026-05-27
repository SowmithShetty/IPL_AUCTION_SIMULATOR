import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CountdownTimer — Heart-pounding auction urgency driver.
 * Large circular ring with dramatic "Going Once / Going Twice" text,
 * color transitions, and screen-edge urgency effects.
 */
export default function CountdownTimer({ isActive, duration = 6, onExpire, onGoingOnce, onGoingTwice }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState('idle');
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
    const threshold1 = duration * 0.6;
    const threshold2 = duration * 0.3;

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
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference * (1 - progress);

  // Color and urgency states
  let ringColor = '#10b981';
  let textColor = 'text-emerald-400';
  let bgGlow = '';
  let isUrgent = false;
  let isCritical = false;

  if (progress < 0.3) {
    ringColor = '#ef4444';
    textColor = 'text-rose-400';
    isCritical = true;
  } else if (progress < 0.6) {
    ringColor = '#f59e0b';
    textColor = 'text-amber-400';
    isUrgent = true;
  }

  // Tick marks around the ring
  const totalTicks = 30;
  const activeTicks = Math.ceil(progress * totalTicks);

  return (
    <div className="relative flex flex-col items-center">
      {/* Screen edge urgency glow */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              boxShadow: 'inset 0 0 120px rgba(239, 68, 68, 0.3), inset 0 0 60px rgba(239, 68, 68, 0.1)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Main timer container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative ${isCritical ? 'heartbeat' : ''}`}
      >
        {/* Outer glow ring */}
        <div
          className="absolute -inset-3 rounded-full opacity-30 blur-xl transition-all duration-300"
          style={{ background: ringColor }}
        />

        <div className="relative w-28 h-28 md:w-32 md:h-32">
          {/* Tick marks */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
            {Array.from({ length: totalTicks }).map((_, i) => {
              const angle = (i / totalTicks) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const isVisible = i < activeTicks;
              const x1 = 60 + Math.cos(rad) * 54;
              const y1 = 60 + Math.sin(rad) * 54;
              const x2 = 60 + Math.cos(rad) * 58;
              const y2 = 60 + Math.sin(rad) * 58;
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isVisible ? ringColor : 'rgba(255,255,255,0.06)'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="transition-all duration-200"
                  style={{ opacity: isVisible ? (isCritical ? 0.9 : 0.6) : 0.3 }}
                />
              );
            })}
          </svg>

          {/* Background ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={ringColor}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100"
              style={{
                filter: `drop-shadow(0 0 ${isCritical ? '12' : '6'}px ${ringColor})`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl md:text-3xl font-display font-black italic tabular-nums ${textColor} transition-colors duration-300`}>
              {Math.ceil(timeLeft)}
            </span>
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest font-display">
              SEC
            </span>
          </div>
        </div>
      </motion.div>

      {/* Digital readout */}
      <div className={`mt-2 text-[11px] font-mono font-bold tabular-nums ${textColor} transition-colors`}>
        00:{timeLeft.toFixed(1).padStart(4, '0')}
      </div>

      {/* Phase text — DRAMATIC */}
      <AnimatePresence mode="wait">
        {phase === 'going_once' && (
          <motion.div
            key="once"
            initial={{ scale: 2.5, opacity: 0, y: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="mt-3"
          >
            <span className="text-sm md:text-base font-display font-black uppercase tracking-[0.15em] text-amber-400 px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 rounded-lg"
              style={{ textShadow: '0 0 20px rgba(245, 158, 11, 0.5)' }}
            >
              ⚡ Going Once...
            </span>
          </motion.div>
        )}
        {phase === 'going_twice' && (
          <motion.div
            key="twice"
            initial={{ scale: 2.5, opacity: 0, y: -15 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1, y: 0 }}
            transition={{
              scale: { repeat: Infinity, duration: 0.6 },
              default: { type: 'spring', stiffness: 400, damping: 15 }
            }}
            className="mt-3"
          >
            <span className="text-sm md:text-base font-display font-black uppercase tracking-[0.15em] text-rose-400 px-4 py-1.5 bg-rose-500/15 border border-rose-500/30 rounded-lg"
              style={{ textShadow: '0 0 25px rgba(239, 68, 68, 0.6)' }}
            >
              🔥 Going Twice!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
