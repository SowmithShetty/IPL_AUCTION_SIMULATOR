import { motion, AnimatePresence } from 'framer-motion';
import { Database } from 'lucide-react';

const formatPlayerName = (fullName) => {
  if (!fullName) return { prefix: '', main: '' };
  
  // Find last space (handles "F. du Plessis" as "F. du" & "Plessis", "J. Fraser-McGurk" as "J." & "Fraser-McGurk")
  const lastSpaceIdx = fullName.lastIndexOf(' ');
  if (lastSpaceIdx !== -1) {
    return {
      prefix: fullName.substring(0, lastSpaceIdx),
      main: fullName.substring(lastSpaceIdx + 1)
    };
  }
  
  // If no space, check for dot
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

export default function PlayerCard({ player, status, currentBid, getDealEvaluation }) {
  const formColors = {
    blazing: 'from-amber-500 to-rose-500',
    hot: 'from-emerald-500 to-teal-500',
    steady: 'from-blue-500 to-indigo-500',
    cold: 'from-zinc-500 to-zinc-600',
    unknown: 'from-zinc-600 to-zinc-700',
  };

  const formLabels = {
    blazing: '🔥 BLAZING',
    hot: '🟢 IN FORM',
    steady: '🔵 STEADY',
    cold: '❄️ COLD',
    unknown: '❓ UNKNOWN',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={player.id}
        initial={{ opacity: 0, y: 50, rotateY: 90, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85, y: -30 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="w-full max-w-sm lg:max-w-md bg-gradient-to-br from-white/10 to-white/[0.03] rounded-[2.5rem] rounded-tr-xl rounded-bl-xl p-[2px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl shrink-0"
        style={{ perspective: '1000px' }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-rose-500/5 pointer-events-none" />

        <div className="bg-[#0a0a0c] rounded-[2.4rem] rounded-tr-[10px] rounded-bl-[10px] p-4 md:p-6 xl:p-8 h-full relative z-10 flex flex-col justify-between gap-4">
          <div>
            {/* Top badges row */}
            <div className="flex justify-between items-start mb-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest text-zinc-400 uppercase">
                  {player.role}
                </div>
                {player.isOverseas && (
                  <div className="bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-full text-[8px] font-black tracking-widest text-rose-400 uppercase">
                    OS
                  </div>
                )}
              </div>
              <div className="bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest text-rose-400 flex items-center gap-1 uppercase">
                <Database className="w-3 h-3" /> {player.setName?.split(':')[0]}
              </div>
            </div>

            {/* Player Name & Info Section */}
            <div className="text-center mb-2 shrink-0">
              {/* Country Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mb-3 text-zinc-300">
                <span className="text-sm leading-none">{player.flag}</span>
                <span className="leading-none">{player.countryName}</span>
              </div>

              {/* Profile Avatar / Initial Badge */}
              <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-white/15 flex items-center justify-center shadow-lg mx-auto mb-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-50" />
                <span className="text-2xl xl:text-3xl font-black italic tracking-tighter text-emerald-400 font-sans select-none">
                  {player.name.replace(/[^A-Z]/g, '').slice(0, 2)}
                </span>
              </div>

              {/* Player Name */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`font-black italic tracking-tighter text-white mb-1.5 leading-tight ${getNameFontSizeClass(player.name)}`}
              >
                {formatPlayerName(player.name).prefix && (
                  <span className="text-zinc-500 font-medium mr-1.5">{formatPlayerName(player.name).prefix}</span>
                )}
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-300 drop-shadow-md">
                  {formatPlayerName(player.name).main.toUpperCase()}
                </span>
              </motion.h2>

              <div className="inline-flex items-center gap-2 flex-wrap justify-center mt-1">
                <span className="border border-white/10 bg-white/5 text-zinc-300 font-bold uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-full">
                  {player.style}
                </span>
              </div>

              {/* Form indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2.5 inline-flex items-center gap-2"
              >
                <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${formColors[player.form] || formColors.steady}`} />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  {formLabels[player.form] || formLabels.steady}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-emerald-400 font-black italic tracking-tighter text-lg xl:text-xl mt-2.5"
              >
                Base: ₹{player.basePrice.toFixed(2)} Cr
              </motion.p>
            </div>
          </div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-black/50 rounded-2xl p-4 border border-white/5 shrink-0"
          >
            {player.role === 'BAT' || player.role === 'WK' ? (
              <div className="grid grid-cols-5 gap-2 text-center">
                <StatCell label="MAT" value={player.stats.matches} />
                <StatCell label="RUNS" value={player.stats.runs} color="text-emerald-400" />
                <StatCell label="HS" value={player.stats.hs} />
                <StatCell label="AVG" value={player.stats.avg} />
                <StatCell label="SR" value={player.stats.sr} color="text-rose-400" />
              </div>
            ) : player.role === 'BOWL' ? (
              <div className="grid grid-cols-5 gap-2 text-center">
                <StatCell label="MAT" value={player.stats.matches} />
                <StatCell label="WKTS" value={player.stats.wickets} color="text-emerald-400" />
                <StatCell label="BBI" value={player.stats.bbi} />
                <StatCell label="AVG" value={player.stats.avg} />
                <StatCell label="ECO" value={player.stats.eco} color="text-rose-400" />
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 text-center">
                <StatCell label="MAT" value={player.stats.matches} />
                <StatCell label="RUNS" value={player.stats.runs} color="text-emerald-400" />
                <StatCell label="SR" value={player.stats.sr} />
                <StatCell label="WKTS" value={player.stats.wickets} color="text-rose-400" />
                <StatCell label="ECO" value={player.stats.eco} />
              </div>
            )}
          </motion.div>

          {/* SOLD / UNSOLD Overlay */}
          {status === 'SOLD' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/85 backdrop-blur-lg rounded-[2.4rem]"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -12 }}
                transition={{ delay: 0.2 }}
                className="border-[6px] border-emerald-500 text-emerald-500 font-black text-5xl md:text-6xl p-5 md:p-6 uppercase tracking-tighter italic shadow-[0_0_60px_rgba(16,185,129,0.4)] mb-6 bg-black/60 backdrop-blur-sm"
              >
                SOLD!
              </motion.div>
              {getDealEvaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`border px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl ${getDealEvaluation(currentBid, player.rating, player.basePrice).color}`}
                >
                  {getDealEvaluation(currentBid, player.rating, player.basePrice).emoji} {getDealEvaluation(currentBid, player.rating, player.basePrice).text}
                </motion.div>
              )}
            </motion.div>
          )}
          {status === 'UNSOLD' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/85 backdrop-blur-lg rounded-[2.4rem]"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -12 }}
                transition={{ delay: 0.2 }}
                className="border-[6px] border-rose-500 text-rose-500 font-black text-5xl md:text-6xl p-5 md:p-6 uppercase tracking-tighter italic shadow-[0_0_60px_rgba(225,29,72,0.4)] bg-black/60 backdrop-blur-sm"
              >
                UNSOLD
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
    <div>
      <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-1 shrink-0">{label}</div>
      <div className={`font-mono font-bold text-xs md:text-sm ${color}`}>{value}</div>
    </div>
  );
}
