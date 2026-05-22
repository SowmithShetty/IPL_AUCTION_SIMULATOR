import { motion, AnimatePresence } from 'framer-motion';
import { TEAM_DATA } from '../data/teams';

/**
 * BiddingWar — A horizontal paddle-raise visualization showing all franchises.
 * When a team bids, their paddle rises with a spring animation.
 * The current leader glows and pulses.
 */
export default function BiddingWar({ highestBidder, userFranchise, aiTeams, currentBid, bidCount, onBid, canBid, status }) {
  const allTeams = [
    { name: userFranchise, isUser: true },
    ...aiTeams.map(t => ({ name: t.name, isUser: false }))
  ];

  const isActive = status === 'BIDDING';

  return (
    <div className="w-full mt-4">
      {/* Bid war indicator */}
      <AnimatePresence>
        {bidCount >= 4 && isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-3"
          >
            <span className="inline-flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full animate-pulse">
              🔥 Bidding War! {bidCount} bids so far
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paddle strip */}
      <div className="flex items-end justify-center gap-1 md:gap-2 px-2">
        {allTeams.map(({ name, isUser }) => {
          const teamData = TEAM_DATA[name];
          if (!teamData) return null;
          const Icon = teamData.icon;
          const isLeader = highestBidder === (isUser ? 'USER' : name);
          const isHighlighted = isLeader && isActive;

          return (
            <motion.div
              key={name}
              className="flex flex-col items-center"
              animate={{
                y: isHighlighted ? -12 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Paddle */}
              <motion.div
                className={`relative w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                  isHighlighted
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : isUser
                    ? 'border-white/20 bg-white/5 hover:bg-white/10'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
                animate={isHighlighted ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={isHighlighted ? { repeat: Infinity, duration: 1.5 } : {}}
                onClick={isUser && canBid && isActive ? onBid : undefined}
                title={isUser ? 'Click to bid!' : name}
              >
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isHighlighted ? 'text-emerald-400' : 'text-zinc-500'}`} />

                {/* Leader crown */}
                <AnimatePresence>
                  {isHighlighted && (
                    <motion.div
                      initial={{ scale: 0, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-3 text-[10px]"
                    >
                      👑
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Team label */}
              <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-wider mt-1 ${
                isHighlighted ? 'text-emerald-400' : isUser ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {teamData.shortName}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
