import { motion } from 'framer-motion';
import { Shield, X } from 'lucide-react';

export default function SquadModal({ onClose, team, franchiseName, purse }) {
  const overseasCount = team.filter(p => p.isOverseas).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#050505] border border-white/10 rounded-[2.5rem] w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <Shield className="text-emerald-400 w-6 md:w-8 h-6 md:h-8" />
            <h2 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">{franchiseName} Squad</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-right mr-2 md:mr-4 border-r border-white/10 pr-4 md:pr-6">
              <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Purse</div>
              <div className="text-xl md:text-2xl font-black italic text-emerald-400 tracking-tighter">₹{purse.toFixed(2)} Cr</div>
            </div>
            <div className="text-right mr-2 border-r border-white/10 pr-4">
              <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Overseas</div>
              <div className="text-xl font-black italic text-amber-400 tracking-tighter">{overseasCount}/8</div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-full transition-colors">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6">
            {team.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col relative overflow-hidden backdrop-blur-sm"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${!player.isRetained ? 'bg-emerald-500' : 'bg-violet-500'}`} />
                <div className="flex justify-between items-start mb-3 pl-3">
                  <div>
                    <h3 className="font-black italic text-lg md:text-xl tracking-tight text-white">
                      {player.flag} {player.name}
                    </h3>
                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5">
                      {player.style} <span className="text-zinc-700">•</span>
                      <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase text-zinc-300">{player.countryName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[9px] bg-black/50 px-2 py-1 rounded font-black tracking-widest text-zinc-300 uppercase border border-white/10">{player.role}</span>
                      {player.isOverseas && (
                        <span className="text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded text-rose-400 font-black border border-rose-500/20 uppercase">OS</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pl-3 mt-auto pt-3 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Type</div>
                    <div className={`text-xs font-black uppercase tracking-widest ${!player.isRetained ? 'text-emerald-400' : 'text-violet-400'}`}>
                      {!player.isRetained ? '🏏 AUCTION' : '🔒 RETAINED'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Cost</div>
                    <div className="text-lg md:text-xl font-black italic tracking-tighter text-white">
                      ₹{player.boughtFor ? player.boughtFor.toFixed(2) : player.basePrice.toFixed(2)} Cr
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {team.length === 0 && (
              <div className="col-span-full text-center p-12 text-zinc-600 font-black tracking-widest uppercase italic text-xl">
                Squad empty. Awaiting picks.
              </div>
            )}
          </div>
        </div>

        <div className="p-3 md:p-6 border-t border-white/10 bg-white/[0.03] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black tracking-widest uppercase rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Return to Auction
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
