import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { TEAM_DATA } from '../data/teams';
import { getTeamPersonality } from '../engine/aiStrategy';

export default function TeamSelection({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 md:p-10 z-10 relative">
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-6">
            🏏 IPL Mega Auction 2025
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic text-white mb-3 uppercase tracking-tighter">
            Select Your Franchise
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm tracking-widest uppercase font-bold">
            Choose the franchise you want to lead through the auction. Each team has unique strengths.
          </p>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full max-w-[1400px]">
        {Object.entries(TEAM_DATA).map(([name, data], index) => {
          const Icon = data.icon || Shield;
          const personality = getTeamPersonality(name);
          return (
            <motion.button
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(name)}
              className="p-6 md:p-8 rounded-[2rem] rounded-tr-sm rounded-bl-sm border border-white/5 bg-white/[0.03] backdrop-blur-md flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-white/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)] transition-all group overflow-hidden relative cursor-pointer"
            >
              <div className={`absolute inset-0 opacity-[0.07] bg-gradient-to-br ${data.theme} group-hover:opacity-25 transition-opacity duration-500`} />
              
              {/* Animated glow ring */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-[2rem] rounded-tr-sm rounded-bl-sm" style={{ boxShadow: `inset 0 0 30px ${data.accent}15` }} />
              </div>

              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20 transition-all group-hover:scale-110 duration-300">
                <Icon className="w-8 h-8 md:w-9 md:h-9 text-zinc-500 group-hover:text-white transition-colors duration-300" />
              </div>
              
              <div className="relative z-10 text-center">
                <h3 className="font-black italic tracking-tighter text-xl md:text-2xl text-zinc-300 group-hover:text-white transition-colors duration-300">
                  {name}
                </h3>
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 mt-1 font-bold transition-colors">
                  {data.shortName}
                </div>
              </div>

              {/* Team personality tag */}
              <div className="relative z-10 text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-zinc-600 group-hover:text-emerald-400/70 font-bold mt-1 transition-colors text-center leading-tight">
                {personality.tag}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
