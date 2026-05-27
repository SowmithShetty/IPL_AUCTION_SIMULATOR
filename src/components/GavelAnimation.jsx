import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * GavelAnimation — Cinematic hammer slam overlay on SOLD.
 * Features massive screen shake, team-colored particle burst,
 * expanding shockwave rings, and price stamp.
 */
export default function GavelAnimation({ show, onComplete, teamAccent, playerName, price }) {
  const [particles, setParticles] = useState([]);
  const accentColor = teamAccent || '#f59e0b';

  useEffect(() => {
    if (show) {
      // Generate particles with team colors
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        size: 3 + Math.random() * 8,
        delay: Math.random() * 0.25,
        duration: 0.6 + Math.random() * 0.6,
        rotation: Math.random() * 360,
        isAccent: Math.random() > 0.4,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
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
              x: [0, -6, 6, -5, 5, -3, 3, -1, 0],
              y: [0, -5, 5, -4, 4, -2, 2, -1, 0],
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Full-screen flash */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at center, ${accentColor}25 0%, transparent 70%)` }}
          />

          {/* Shockwave ring 1 — team colored */}
          <motion.div
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute w-24 h-24 rounded-full"
            style={{ border: `3px solid ${accentColor}80` }}
          />

          {/* Shockwave ring 2 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
            className="absolute w-20 h-20 rounded-full border-2 border-emerald-400/50"
          />

          {/* Shockwave ring 3 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="absolute w-16 h-16 rounded-full border-2 border-white/30"
          />

          {/* Gavel icon — slamming down */}
          <motion.div
            initial={{ y: -150, rotate: -45, scale: 1.8, opacity: 0 }}
            animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 600,
              damping: 15,
              duration: 0.4,
            }}
            className="relative z-10 text-7xl md:text-8xl lg:text-9xl"
            style={{ filter: `drop-shadow(0 0 40px ${accentColor}80)` }}
          >
            🔨
          </motion.div>

          {/* Price stamp that slams in */}
          {price && (
            <motion.div
              initial={{ scale: 3, y: -40, opacity: 0 }}
              animate={{ scale: 1, y: 60, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute z-20 text-center"
            >
              <div className="font-display font-black italic text-3xl md:text-4xl text-white tracking-tighter"
                style={{ textShadow: `0 0 30px ${accentColor}80` }}
              >
                ₹{price} <span className="text-lg text-zinc-400">Crores</span>
              </div>
            </motion.div>
          )}

          {/* Team-colored particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 0,
                rotate: p.rotation,
              }}
              transition={{
                duration: p.duration,
                delay: 0.15 + p.delay,
                ease: 'easeOut',
              }}
              className="absolute rounded-sm"
              style={{
                width: p.size,
                height: p.size,
                background: p.isAccent ? accentColor : `hsl(${40 + Math.random() * 20}, 90%, ${60 + Math.random() * 20}%)`,
                boxShadow: `0 0 ${p.size * 2}px ${p.isAccent ? accentColor : 'hsl(45, 90%, 60%)'}`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
