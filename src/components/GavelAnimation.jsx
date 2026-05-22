import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * GavelAnimation — Dramatic hammer slam overlay on SOLD.
 * Features screen shake, golden particle burst, and expanding shockwave ring.
 */
export default function GavelAnimation({ show, onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      // Generate golden particles for the burst effect
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 0.2,
        duration: 0.5 + Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
        >
          {/* Screen shake wrapper */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [0, -4, 4, -3, 3, -1, 1, 0],
              y: [0, -3, 3, -2, 2, -1, 1, 0],
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Shockwave ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-32 h-32 rounded-full border-4 border-amber-400/60"
          />

          {/* Second shockwave */}
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="absolute w-24 h-24 rounded-full border-2 border-emerald-400/40"
          />

          {/* Gavel icon */}
          <motion.div
            initial={{ y: -120, rotate: -45, scale: 1.5 }}
            animate={{ y: 0, rotate: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 15,
              duration: 0.4,
            }}
            className="relative z-10 text-7xl md:text-8xl drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]"
          >
            🔨
          </motion.div>

          {/* Flash */}
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-amber-500/10"
          />

          {/* Golden particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: p.duration,
                delay: 0.15 + p.delay,
                ease: 'easeOut',
              }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: `hsl(${40 + Math.random() * 20}, 90%, ${60 + Math.random() * 20}%)`,
                boxShadow: `0 0 ${p.size * 2}px hsl(45, 90%, 60%)`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
