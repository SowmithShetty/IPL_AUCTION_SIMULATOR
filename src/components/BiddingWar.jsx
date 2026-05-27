import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_DATA } from '../data/teams';

/**
 * BiddingWar — Team-colored paddle visualization.
 * Each franchise paddle uses their real accent color.
 * Active bidder rises with trail. User paddle is prominent.
 */
export default function BiddingWar({ highestBidder, userFranchise, aiTeams, currentBid, bidCount, onBid, canBid, status }) {
  const allTeams = [
    { name: userFranchise, isUser: true },
    ...aiTeams.map(t => ({ name: t.name, isUser: false, purse: t.purse }))
  ];

  const isActive = status === 'BIDDING';
  const isWarActive = bidCount >= 4 && isActive;

  return (
    <div className="w-full mt-4">
      {/* Bidding War Indicator */}
      <AnimatePresence>
        {isWarActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-3"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-display font-black uppercase tracking-[0.15em] text-[10px]"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15), rgba(234,179,8,0.15))',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              🔥 Bidding War! {bidCount} bids
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 live-pulse" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paddle Strip */}
      <div className={`flex items-end justify-center gap-1.5 md:gap-2 px-2 py-2 rounded-xl transition-all duration-500 ${
        isWarActive ? 'bg-gradient-to-r from-rose-500/5 via-orange-500/5 to-amber-500/5 border border-rose-500/10' : ''
      }`}>
        {allTeams.map(({ name, isUser, purse }) => {
          const teamData = TEAM_DATA[name];
          if (!teamData) return null;
          const Icon = teamData.icon;
          const accent = teamData.accent;
          const isLeader = highestBidder === (isUser ? 'USER' : name);
          const isHighlighted = isLeader && isActive;

          return (
            <motion.div
              key={name}
              className="flex flex-col items-center"
              animate={{
                y: isHighlighted ? -16 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Crown — animated bounce */}
              <AnimatePresence>
                {isHighlighted && (
                  <motion.div
                    initial={{ scale: 0, y: 8 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="text-[11px] mb-0.5 crown-bounce"
                  >
                    👑
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Paddle — team-colored */}
              <motion.div
                className={`relative flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                  isUser ? 'w-11 h-11 md:w-13 md:h-13' : 'w-9 h-9 md:w-11 md:h-11'
                } ${
                  isUser && !isHighlighted ? 'border-amber-500/30' : ''
                }`}
                style={{
                  borderColor: isHighlighted ? accent : isUser ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)',
                  background: isHighlighted
                    ? `linear-gradient(135deg, ${accent}30, ${accent}10)`
                    : isUser
                    ? 'rgba(245,158,11,0.05)'
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: isHighlighted ? `0 0 25px ${accent}40, inset 0 0 15px ${accent}15` : 'none',
                  cursor: isUser && canBid && isActive ? 'pointer' : 'default',
                }}
                animate={isHighlighted ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={isHighlighted ? { repeat: Infinity, duration: 1.5 } : {}}
                onClick={isUser && canBid && isActive ? onBid : undefined}
                title={isUser ? 'Click to bid!' : name}
              >
                <Icon
                  className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-300"
                  style={{ color: isHighlighted ? accent : isUser ? '#f59e0b80' : '#52525b' }}
                />

                {/* User indicator ring */}
                {isUser && !isHighlighted && (
                  <div className="absolute -inset-[2px] rounded-xl border border-amber-500/20 pointer-events-none" />
                )}
              </motion.div>

              {/* Team label with purse */}
              <span
                className="text-[7px] md:text-[8px] font-black uppercase tracking-wider mt-1 font-display transition-colors duration-300"
                style={{
                  color: isHighlighted ? accent : isUser ? '#a1a1aa' : '#52525b'
                }}
              >
                {teamData.shortName}
              </span>

              {/* Mini purse indicator */}
              {purse !== undefined && (
                <span className={`text-[6px] font-mono font-bold tabular-nums ${
                  purse < 15 ? 'text-rose-500/60' : 'text-zinc-700'
                }`}>
                  ₹{purse.toFixed(0)}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
