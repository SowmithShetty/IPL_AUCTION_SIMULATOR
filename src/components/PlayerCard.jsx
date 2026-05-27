import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Shield, Target, Crosshair } from 'lucide-react';

const formatPlayerName = (fullName) => {
  if (!fullName) return { prefix: '', main: '' };
  const lastSpaceIdx = fullName.lastIndexOf(' ');
  if (lastSpaceIdx !== -1) {
    return {
      prefix: fullName.substring(0, lastSpaceIdx),
      main: fullName.substring(lastSpaceIdx + 1)
    };
  }
  if (fullName.includes('.')) {
    const dotIdx = fullName.indexOf('.');
    return {
      prefix: fullName.substring(0, dotIdx + 1),
      main: fullName.substring(dotIdx + 1).trim()
    };
  }
  return { prefix: '', main: fullName };
};

const getNameFontSizeClass = (name) => {
  if (!name) return 'text-3xl';
  const len = name.length;
  if (len > 18) return 'text-lg md:text-xl lg:text-2xl';
  if (len > 14) return 'text-xl md:text-2xl lg:text-3xl';
  if (len > 10) return 'text-2xl md:text-3xl lg:text-4xl';
  return 'text-3xl md:text-4xl lg:text-5xl';
};

const ROLE_CONFIG = {
  BAT: { color: 'from-blue-500 to-sky-400', textColor: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', icon: '🏏', label: 'BATTER' },
  BOWL: { color: 'from-red-500 to-orange-400', textColor: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25', icon: '⚡', label: 'BOWLER' },
  AR: { color: 'from-violet-500 to-purple-400', textColor: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/25', icon: '🔄', label: 'ALL-ROUNDER' },
  WK: { color: 'from-amber-500 to-yellow-400', textColor: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', icon: '🧤', label: 'KEEPER' },
};

const formConfig = {
  blazing: { gradient: 'from-amber-500 to-rose-500', label: '🔥 BLAZING', textColor: 'text-amber-400' },
  hot: { gradient: 'from-emerald-500 to-teal-500', label: '🟢 IN FORM', textColor: 'text-emerald-400' },
  steady: { gradient: 'from-blue-500 to-indigo-500', label: '🔵 STEADY', textColor: 'text-blue-400' },
  cold: { gradient: 'from-zinc-500 to-zinc-600', label: '❄️ COLD', textColor: 'text-zinc-400' },
  unknown: { gradient: 'from-zinc-600 to-zinc-700', label: '❓ UNKNOWN', textColor: 'text-zinc-500' },
};

// Rating ring component
function RatingRing({ rating }) {
  const circumference = 2 * Math.PI * 22;
  const progress = Math.min(rating / 100, 1);
  const offset = circumference * (1 - progress);

  let ringColor = '#a1a1aa'; // zinc
  let labelColor = 'text-zinc-400';
  if (rating >= 92) { ringColor = '#f59e0b'; labelColor = 'text-amber-400'; }
  else if (rating >= 87) { ringColor = '#10b981'; labelColor = 'text-emerald-400'; }
  else if (rating >= 82) { ringColor = '#60a5fa'; labelColor = 'text-blue-400'; }

  return (
    <div className="relative w-14 h-14 xl:w-16 xl:h-16">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
        <circle
          cx="24" cy="24" r="22" fill="none"
          stroke={ringColor} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm xl:text-base font-black italic tabular-nums font-display ${labelColor}`}>
          {rating}
        </span>
      </div>
    </div>
  );
}

export default function PlayerCard({ player, status, currentBid, getDealEvaluation }) {
  const role = ROLE_CONFIG[player.role] || ROLE_CONFIG.BAT;
  const form = formConfig[player.form] || formConfig.steady;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={player.id}
        initial={{ opacity: 0, x: 80, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85, x: -40 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="w-full max-w-sm lg:max-w-md bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl p-[1.5px] border border-white/[0.08] shadow-2xl relative overflow-hidden backdrop-blur-xl shrink-0"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.03] via-transparent to-rose-500/[0.03] pointer-events-none" />

        <div className="bg-[#0a0a0c]/95 rounded-[14px] p-4 md:p-5 xl:p-6 h-full relative z-10 flex flex-col justify-between gap-3">
          <div>
            {/* Top row: Role + Set + Rating */}
            <div className="flex justify-between items-start mb-4 shrink-0">
              <div className="flex items-center gap-1.5">
                {/* Role Badge — color coded */}
                <div className={`${role.bg} border ${role.border} px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest ${role.textColor} uppercase flex items-center gap-1 font-display`}>
                  <span className="text-[10px]">{role.icon}</span> {role.label}
                </div>
                {player.isOverseas && (
                  <div className="bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg text-[8px] font-black tracking-widest text-rose-400 uppercase font-display">
                    OS
                  </div>
                )}
              </div>
              {/* Rating Ring */}
              <RatingRing rating={player.rating} />
            </div>

            {/* Player Name — Broadcast Typography */}
            <div className="text-center mb-3 shrink-0">
              {/* Avatar with team ring */}
              <div className="w-16 h-16 xl:w-18 xl:h-18 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-white/15 flex items-center justify-center shadow-lg mx-auto mb-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-50" />
                <span className="text-xl xl:text-2xl font-black italic tracking-tighter text-emerald-400 font-display select-none">
                  {player.name.replace(/[^A-Z]/g, '').slice(0, 2)}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 text-base bg-[#0a0a0c] rounded-full p-0.5 leading-none shadow-md">{player.flag}</span>
              </div>

              {/* First Name (small) */}
              {formatPlayerName(player.name).prefix && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-zinc-500 font-medium text-xs md:text-sm tracking-widest uppercase font-display mb-0.5"
                >
                  {formatPlayerName(player.name).prefix}
                </motion.div>
              )}

              {/* Surname (MASSIVE) */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`font-display font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-300 leading-tight drop-shadow-md ${getNameFontSizeClass(formatPlayerName(player.name).main)}`}
              >
                {formatPlayerName(player.name).main.toUpperCase()}
              </motion.h2>

              {/* Style + Form */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mt-2"
              >
                <span className="border border-white/10 bg-white/5 text-zinc-300 font-bold uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-md font-display">
                  {player.style}
                </span>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${form.gradient}`} />
                  <span className={`text-[7px] font-black uppercase tracking-widest font-display ${form.textColor}`}>
                    {form.label}
                  </span>
                </div>
              </motion.div>

              {/* Set Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-2 inline-flex items-center gap-1.5 bg-rose-500/8 border border-rose-500/15 px-2.5 py-1 rounded-lg"
              >
                <Database className="w-2.5 h-2.5 text-rose-400" />
                <span className="text-[8px] font-black tracking-widest text-rose-400 uppercase font-display">
                  {player.setName?.split(':')[0]}
                </span>
              </motion.div>

              {/* Base Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-emerald-400 font-black italic tracking-tighter text-base xl:text-lg mt-2.5 font-display"
              >
                Base: ₹{player.basePrice.toFixed(2)} Cr
              </motion.div>
            </div>
          </div>

          {/* Stats Panel — Scoreboard Style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-black/60 rounded-xl p-3 border border-white/[0.04] shrink-0"
          >
            {player.role === 'BAT' || player.role === 'WK' ? (
              <div className="grid grid-cols-5 gap-1 text-center">
                <StatCell label="MAT" value={player.stats.matches} />
                <StatCell label="RUNS" value={player.stats.runs} color="text-emerald-400" />
                <StatCell label="HS" value={player.stats.hs} />
                <StatCell label="AVG" value={player.stats.avg} />
                <StatCell label="SR" value={player.stats.sr} color="text-rose-400" />
              </div>
            ) : player.role === 'BOWL' ? (
              <div className="grid grid-cols-5 gap-1 text-center">
                <StatCell label="MAT" value={player.stats.matches} />
                <StatCell label="WKTS" value={player.stats.wickets} color="text-emerald-400" />
                <StatCell label="BBI" value={player.stats.bbi} />
                <StatCell label="AVG" value={player.stats.avg} />
                <StatCell label="ECO" value={player.stats.eco} color="text-rose-400" />
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1 text-center">
                <StatCell label="MAT" value={player.stats.matches} />
                <StatCell label="RUNS" value={player.stats.runs} color="text-emerald-400" />
                <StatCell label="SR" value={player.stats.sr} />
                <StatCell label="WKTS" value={player.stats.wickets} color="text-rose-400" />
                <StatCell label="ECO" value={player.stats.eco} />
              </div>
            )}
          </motion.div>

          {/* SOLD Overlay */}
          {status === 'SOLD' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/90 backdrop-blur-lg rounded-[14px]"
            >
              {/* Radial glow */}
              <div className="absolute inset-0 rounded-[14px]" style={{
                background: 'radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, transparent 70%)'
              }} />

              <motion.div
                initial={{ scale: 3, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: -12, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="relative"
              >
                <div className="border-[5px] border-emerald-500 text-emerald-500 font-display font-black text-4xl md:text-5xl px-8 py-4 uppercase tracking-tighter italic mb-2"
                  style={{ boxShadow: '0 0 60px rgba(16,185,129,0.4), inset 0 0 30px rgba(16,185,129,0.1)' }}
                >
                  SOLD!
                </div>
              </motion.div>

              {/* Price tag */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white font-display font-black text-2xl italic tracking-tighter mt-3"
              >
                ₹{currentBid.toFixed(2)} <span className="text-sm text-zinc-400">Crores</span>
              </motion.div>

              {getDealEvaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-4 font-display ${getDealEvaluation(currentBid, player.rating, player.basePrice).color}`}
                >
                  {getDealEvaluation(currentBid, player.rating, player.basePrice).emoji} {getDealEvaluation(currentBid, player.rating, player.basePrice).text}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* UNSOLD Overlay */}
          {status === 'UNSOLD' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/90 backdrop-blur-lg rounded-[14px]"
            >
              {/* Radial glow */}
              <div className="absolute inset-0 rounded-[14px]" style={{
                background: 'radial-gradient(circle at center, rgba(225,29,72,0.1) 0%, transparent 70%)'
              }} />

              <motion.div
                initial={{ scale: 3, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: -12, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <div className="border-[5px] border-rose-500 text-rose-500 font-display font-black text-4xl md:text-5xl px-8 py-4 uppercase tracking-tighter italic"
                  style={{ boxShadow: '0 0 60px rgba(225,29,72,0.4), inset 0 0 30px rgba(225,29,72,0.1)' }}
                >
                  UNSOLD
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-4 font-display"
              >
                No takers at ₹{player.basePrice.toFixed(2)} Cr
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCell({ label, value, color = 'text-white' }) {
  return (
    <div className="py-1">
      <div className="text-[7px] text-zinc-600 uppercase tracking-widest font-black mb-0.5 shrink-0 font-display">{label}</div>
      <div className={`font-mono font-bold text-xs ${color}`}>{value}</div>
    </div>
  );
}
