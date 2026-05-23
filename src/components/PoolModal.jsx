import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, X, Search } from 'lucide-react';
import { POOL_CATEGORIES } from '../data/players';
import { getDealEvaluation } from '../engine/auctionLogic';

export default function PoolModal({ onClose, poolData }) {
  const [activeSet, setActiveSet] = useState(1);

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
        className="bg-[#050505] border border-white/10 rounded-[2.5rem] w-full max-w-7xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <Database className="text-rose-500 w-6 md:w-8 h-6 md:h-8" />
            <h2 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">
              Auction Intel <span className="text-rose-500">[{poolData.length}]</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-full transition-colors">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Category sidebar */}
          <div className="w-1/3 md:w-1/4 border-r border-white/10 bg-white/[0.02] overflow-y-auto p-3 md:p-4 space-y-1.5">
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black px-2 mb-3 flex items-center gap-2">
              <Search className="w-3 h-3" /> Categories
            </div>
            {POOL_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveSet(category.id)}
                className={`w-full text-left p-2.5 md:p-3 rounded-xl transition-all ${
                  activeSet === category.id
                    ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                    : 'hover:bg-white/5 text-zinc-400 border border-transparent'
                }`}
              >
                <div className="font-black italic text-[11px] md:text-sm tracking-tight uppercase">{category.name}</div>
                <div className="text-[8px] md:text-[9px] uppercase tracking-widest opacity-50 mt-0.5">{category.desc}</div>
              </button>
            ))}
          </div>

          {/* Player list */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
            <div className="mb-4 md:mb-6 flex justify-between items-end border-b border-white/10 pb-3 md:pb-4">
              <h3 className="text-xl md:text-2xl font-black italic text-white tracking-tighter uppercase">
                {POOL_CATEGORIES.find(c => c.id === activeSet)?.name}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6">
              {poolData.filter(p => p.setId === activeSet).map((player) => {
                const evalData = player.status === 'SOLD' ? getDealEvaluation(player.price, player.rating, player.basePrice) : null;
                return (
                  <div key={player.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col relative overflow-hidden backdrop-blur-sm hover:bg-white/[0.06] transition-colors min-w-0">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      player.status === 'SOLD' ? 'bg-emerald-500' :
                      (player.status === 'UNSOLD' || player.status === 'SKIPPED') ? 'bg-rose-500' : 'bg-zinc-700'
                    }`} />
                    <div className="flex justify-between items-start mb-3 pl-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black italic text-lg md:text-xl tracking-tight text-white truncate">
                          {player.flag} {player.name}
                        </h3>
                        <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5 flex-wrap">
                          <span className="truncate max-w-[160px]">{player.style}</span> <span className="text-zinc-700 shrink-0">•</span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase text-zinc-300 shrink-0">{player.countryName}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[9px] bg-black/50 px-2 py-1 rounded font-black tracking-widest text-zinc-300 uppercase border border-white/10">{player.role}</span>
                          {player.isOverseas && (
                            <span className="text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded text-rose-400 font-black border border-rose-500/20 uppercase">OS</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pl-4 mb-3 grid grid-cols-4 gap-2 text-center bg-black/30 rounded-lg p-2 border border-white/5">
                      <div><div className="text-[8px] text-zinc-500 uppercase font-black">MAT</div><div className="text-xs font-mono text-white">{player.stats.matches}</div></div>
                      {player.role === 'BOWL' ? (
                        <>
                          <div><div className="text-[8px] text-zinc-500 uppercase font-black">WKTS</div><div className="text-xs font-mono text-emerald-400">{player.stats.wickets}</div></div>
                          <div><div className="text-[8px] text-zinc-500 uppercase font-black">ECO</div><div className="text-xs font-mono text-white">{player.stats.eco}</div></div>
                          <div><div className="text-[8px] text-zinc-500 uppercase font-black">BBI</div><div className="text-xs font-mono text-white">{player.stats.bbi}</div></div>
                        </>
                      ) : (
                        <>
                          <div><div className="text-[8px] text-zinc-500 uppercase font-black">RUNS</div><div className="text-xs font-mono text-emerald-400">{player.stats.runs}</div></div>
                          <div><div className="text-[8px] text-zinc-500 uppercase font-black">SR</div><div className="text-xs font-mono text-rose-400">{player.stats.sr}</div></div>
                          <div><div className="text-[8px] text-zinc-500 uppercase font-black">HS</div><div className="text-xs font-mono text-white">{player.stats.hs}</div></div>
                        </>
                      )}
                    </div>

                    <div className="pl-4 mt-auto pt-3 border-t border-white/5 flex justify-between items-end gap-3">
                      <div>
                        <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Status</div>
                        <div className={`text-xs font-black uppercase tracking-widest ${
                          player.status === 'AVAILABLE' ? 'text-zinc-400' :
                          (player.status === 'UNSOLD' || player.status === 'SKIPPED') ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {player.status === 'SOLD' ? `SOLD → ${player.boughtBy}` : player.status}
                        </div>
                        {evalData && (
                          <div className={`text-[9px] mt-1.5 inline-block px-2 py-0.5 rounded-sm uppercase tracking-widest border font-black ${evalData.color}`}>
                            {evalData.emoji} {evalData.text}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">
                          {player.status === 'SOLD' ? 'Final' : 'Base'}
                        </div>
                        <div className={`text-lg md:text-xl font-black italic tracking-tighter ${player.status === 'SOLD' ? 'text-white' : 'text-zinc-500'}`}>
                          ₹{(player.price || player.basePrice).toFixed(2)} Cr
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 md:p-6 border-t border-white/10 bg-white/[0.03] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-black font-black tracking-widest uppercase rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(225,29,72,0.3)]">
            Return to Auction
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
