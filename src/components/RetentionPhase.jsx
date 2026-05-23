import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RETENTION_COSTS } from '../data/players';

export default function RetentionPhase({ squad, onConfirm, franchiseName }) {
  const [selected, setSelected] = useState([]);

  const togglePlayer = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(pId => pId !== id));
    else if (selected.length < 4) setSelected([...selected, id]);
  };

  const totalCost = selected.reduce((sum, _, index) => sum + RETENTION_COSTS[index], 0);

  return (
    <div className="p-5 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto z-10 relative min-h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 md:mb-8 border-l-4 border-emerald-500 pl-5 md:pl-6 flex flex-col md:flex-row justify-between md:items-end gap-4"
      >
        <div>
          <div className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] font-black mb-2">Pre-Auction Phase</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic text-white uppercase tracking-tighter">{franchiseName} Retention</h2>
          <p className="text-zinc-400 font-mono text-sm mt-2 uppercase tracking-widest">Select up to 4 players to retain. Costs apply dynamically.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          <AnimatePresence>
            {squad.map((player, index) => {
              const isSelected = selected.includes(player.id);
              const cost = isSelected ? RETENTION_COSTS[selected.indexOf(player.id)] : null;
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => togglePlayer(player.id)}
                  className={`relative p-5 md:p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-md ${
                    isSelected
                      ? 'bg-emerald-950/20 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                      : 'bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] uppercase font-black px-3 py-1.5 rounded-bl-xl rounded-tr-xl tracking-widest"
                    >
                      Retained — ₹{cost}Cr
                    </motion.div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black italic tracking-tight text-lg md:text-xl text-white">
                        {player.flag} {player.name}
                      </h3>
                      <div className="flex gap-2 items-center mt-1.5">
                        <span className="text-[10px] bg-black/50 px-2.5 py-1 rounded text-zinc-300 font-mono border border-white/10">{player.role}</span>
                        {player.isOverseas && (
                          <span className="text-[9px] bg-rose-500/10 px-2.5 py-1 rounded text-rose-400 font-black border border-rose-500/20 uppercase tracking-wider">Overseas</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-4 flex items-center gap-1.5 flex-wrap">
                    {player.style} <span className="text-zinc-700">•</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest text-zinc-300 uppercase">{player.countryName}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] md:text-[11px] font-mono text-zinc-400 border-t border-white/5 pt-3">
                    <span>MAT: <span className="text-white font-bold">{player.stats.matches}</span></span>
                    {player.role === 'BOWL' ? (
                      <span>WKTS: <span className="text-white font-bold">{player.stats.wickets}</span> | ECO: <span className="text-white font-bold">{player.stats.eco}</span></span>
                    ) : (
                      <span>RUNS: <span className="text-white font-bold">{player.stats.runs}</span> | SR: <span className="text-white font-bold">{player.stats.sr}</span></span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Strategy Config Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] rounded-tr-sm rounded-bl-sm h-fit sticky top-8"
        >
          <h3 className="text-lg md:text-xl font-black italic tracking-tighter uppercase mb-6 text-white border-b border-white/10 pb-4">
            Retention Slots
          </h3>

          <div className="space-y-3 mb-8">
            {[0, 1, 2, 3].map(slot => (
              <div key={slot} className="flex justify-between items-center p-3 md:p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                  Slot {slot + 1} <span className="text-emerald-500/50">[{RETENTION_COSTS[slot]}Cr]</span>
                </span>
                {selected[slot] ? (
                  <span className="text-sm font-black italic text-emerald-400 tracking-tight">
                    {squad.find(p => p.id === selected[slot])?.name}
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Empty</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end mb-8 pt-4 border-t border-white/10">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Remaining Purse</span>
            <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
              ₹{(100 - totalCost).toFixed(2)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const retainedPlayersWithCost = selected.map((id, index) => {
                const p = squad.find(player => player.id === id);
                return { ...p, boughtFor: RETENTION_COSTS[index], isRetained: true };
              });
              onConfirm(retainedPlayersWithCost, totalCost);
            }}
            className="w-full py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-lg bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            🏏 Begin Auction
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
