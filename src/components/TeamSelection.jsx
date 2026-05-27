import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { TEAM_DATA } from '../data/teams';
import { getTeamPersonality } from '../engine/aiStrategy';

export default function TeamSelection({ onSelect }) {
  const letterVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.7, filter: 'blur(6px)' },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      transition: { delay: 0.3 + i * 0.04, type: 'spring', stiffness: 200, damping: 15 }
    })
  };

  const titleText = "SELECT YOUR FRANCHISE";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 md:p-10 z-10 relative">
      {/* Cinematic Header */}
      <div className="text-center mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          {/* Year Badge */}
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-[0.35em] px-6 py-2.5 rounded-full mb-8 backdrop-blur-sm font-display">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse" />
            IPL Mega Auction 2025
          </div>
        </motion.div>

        {/* Staggered Title */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-4">
          {titleText.split(' ').map((word, wi) => (
            <div key={wi} className="flex">
              {word.split('').map((char, ci) => {
                const globalIdx = titleText.indexOf(word) + ci;
                return (
                  <motion.span
                    key={`${wi}-${ci}`}
                    custom={globalIdx}
                    initial="hidden"
                    animate="visible"
                    variants={letterVariants}
                    className="text-4xl md:text-6xl lg:text-7xl font-black italic text-white uppercase tracking-tighter font-display"
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-zinc-500 max-w-2xl mx-auto text-xs md:text-sm tracking-[0.2em] uppercase font-bold font-display"
        >
          Choose the franchise you want to lead. Build your dream XI.
        </motion.p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 w-full max-w-[1400px]">
        {Object.entries(TEAM_DATA).map(([name, data], index) => {
          const Icon = data.icon || Shield;
          const personality = getTeamPersonality(name);
          return (
            <motion.button
              key={name}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.07, type: 'spring', stiffness: 180, damping: 18 }}
              whileHover={{ scale: 1.06, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(name)}
              className="group relative p-5 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-white/25 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{
                '--team-color': data.accent,
              }}
            >
              {/* Team color flood on hover — much stronger */}
              <div
                className="absolute inset-0 opacity-[0.05] group-hover:opacity-30 transition-opacity duration-700"
                style={{ background: `linear-gradient(135deg, ${data.accent}40, ${data.accent}10)` }}
              />

              {/* Accent glow ring */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 40px ${data.accent}20, 0 0 30px ${data.accent}15` }}
              />

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-[15%] right-[15%] h-[2px] rounded-full opacity-0 group-hover:opacity-80 transition-all duration-500 group-hover:left-[5%] group-hover:right-[5%]"
                style={{ background: `linear-gradient(90deg, transparent, ${data.accent}, transparent)` }}
              />

              {/* Icon Container */}
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/25 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                }}
              >
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-zinc-500 group-hover:text-white transition-all duration-500 drop-shadow-lg"
                  style={{ filter: `drop-shadow(0 0 12px ${data.accent}00)` }}
                />
                {/* Icon glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 20px ${data.accent}30` }}
                />
              </div>

              {/* Team Name */}
              <div className="relative z-10 text-center">
                <h3 className="font-display font-black italic tracking-tighter text-xl md:text-2xl text-zinc-300 group-hover:text-white transition-colors duration-300">
                  {name}
                </h3>
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-zinc-600 group-hover:text-zinc-400 mt-0.5 font-bold transition-colors font-display"
                  style={{ color: undefined }}
                >
                  {data.shortName}
                </div>
              </div>

              {/* Personality Tag */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-black font-display transition-colors duration-500 text-center leading-tight"
                  style={{ color: `${data.accent}60` }}
                >
                  {personality.tag}
                </div>
                {/* Arrow indicator */}
                <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-white/50 transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
