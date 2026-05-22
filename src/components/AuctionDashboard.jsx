import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, Users } from 'lucide-react';
import PlayerCard from './PlayerCard';
import BiddingWar from './BiddingWar';
import CountdownTimer from './CountdownTimer';
import GavelAnimation from './GavelAnimation';
import Leaderboard from './Leaderboard';
import { getNextBid, getDealEvaluation } from '../engine/auctionLogic';

export default function AuctionDashboard({
  player, currentBid, highestBidder, status, logs, userPurse,
  onStart, onBid, onNext, poolRemaining, userFranchise, userTeam,
  onSkipSet, aiTeams, bidCount, salesLog, onResolve,
}) {
  const isHighest = highestBidder === 'USER';
  const canAfford = userPurse >= getNextBid(currentBid);
  const overseasCount = userTeam.filter(p => p.isOverseas).length;
  const isOverseasLimitReached = player.isOverseas && overseasCount >= 8;
  const canBid = !isHighest && canAfford && !isOverseasLimitReached && status === 'BIDDING';

  const [showGavel, setShowGavel] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownResetKey = useRef(0);

  // Reset countdown whenever a new bid comes in
  useEffect(() => {
    if (status === 'BIDDING' && highestBidder) {
      setCountdownActive(false);
      // Small delay then restart countdown
      const t = setTimeout(() => {
        countdownResetKey.current++;
        setCountdownActive(true);
      }, 50);
      return () => clearTimeout(t);
    } else {
      setCountdownActive(false);
    }
  }, [currentBid, highestBidder, status]);

  // Show gavel on SOLD
  useEffect(() => {
    if (status === 'SOLD') {
      setShowGavel(true);
      setCountdownActive(false);
    } else if (status === 'UNSOLD') {
      setCountdownActive(false);
    }
  }, [status]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && status === 'BIDDING' && canBid) {
        e.preventDefault();
        onBid();
      } else if (e.code === 'Enter' && (status === 'SOLD' || status === 'UNSOLD')) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, canBid, onBid, onNext]);

  const handleCountdownExpire = useCallback(() => {
    if (status === 'BIDDING') {
      onResolve();
    }
  }, [status, onResolve]);

  return (
    <>
      <GavelAnimation show={showGavel} onComplete={() => setShowGavel(false)} />

      <div className="p-3 md:p-6 lg:p-8 max-w-[1500px] mx-auto h-full flex flex-col lg:flex-row gap-4 lg:gap-6 z-10 relative items-stretch pb-12">
        {/* LEFT: Player Card */}
        <div className="w-full lg:w-[32%] flex flex-col justify-center items-center gap-4">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Users className="w-3 h-3" /> Remaining: <span className="text-white">{poolRemaining}</span>
          </div>

          <PlayerCard
            player={player}
            status={status}
            currentBid={currentBid}
            getDealEvaluation={getDealEvaluation}
          />
        </div>

        {/* CENTER: Bidding Control */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center gap-4">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] rounded-tl-xl rounded-br-xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <DollarSign className="w-3 h-3" /> Active Bid
            </h3>

            {/* Bid amount — scales up for big bids */}
            <motion.div
              key={currentBid}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`font-black italic tracking-tighter text-white mb-4 tabular-nums drop-shadow-lg ${
                currentBid >= 15 ? 'text-6xl md:text-7xl text-amber-400' :
                currentBid >= 10 ? 'text-6xl md:text-7xl text-rose-400' :
                'text-6xl md:text-7xl'
              }`}
            >
              ₹{currentBid.toFixed(2)} <span className="text-2xl md:text-3xl text-zinc-600">Cr</span>
            </motion.div>

            {/* Highest bidder indicator */}
            <div className="h-9 flex items-center justify-center mb-4">
              {highestBidder ? (
                <motion.span
                  key={highestBidder}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                    highestBidder === 'USER'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                  }`}
                >
                  {highestBidder === 'USER' ? `👑 ${userFranchise}` : `🏏 ${highestBidder}`}
                </motion.span>
              ) : (
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                  Awaiting First Bid...
                </span>
              )}
            </div>

            {/* Countdown Timer */}
            {status === 'BIDDING' && highestBidder && (
              <div className="flex justify-center mb-4">
                <CountdownTimer
                  key={countdownResetKey.current}
                  isActive={countdownActive}
                  duration={highestBidder ? 5 : 7}
                  onExpire={handleCountdownExpire}
                  onGoingOnce={() => {}}
                  onGoingTwice={() => {}}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 relative z-10">
              {status === 'WAITING' && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onStart}
                  className="w-full py-5 rounded-2xl font-black italic tracking-tighter uppercase text-2xl bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  🏏 Open Bidding
                </motion.button>
              )}
              {status === 'BIDDING' && (
                <motion.button
                  whileHover={canBid ? { scale: 1.03 } : {}}
                  whileTap={canBid ? { scale: 0.97 } : {}}
                  onClick={canBid ? onBid : undefined}
                  disabled={!canBid}
                  className={`w-full py-5 md:py-6 rounded-2xl font-black italic tracking-tighter uppercase text-xl md:text-2xl transition-all ${
                    isHighest ? 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5' :
                    isOverseasLimitReached ? 'bg-rose-950/40 text-rose-500 cursor-not-allowed border border-rose-900/50' :
                    !canAfford ? 'bg-rose-950/40 text-rose-500 cursor-not-allowed border border-rose-900/50' :
                    'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                  }`}
                >
                  {isHighest ? '✓ Holding Lead' :
                   isOverseasLimitReached ? '🚫 Max 8 Overseas' :
                   !canAfford ? '🚫 Insufficient Funds' :
                   `🏏 Bid ₹${getNextBid(currentBid).toFixed(2)} Cr`}
                </motion.button>
              )}
              {(status === 'SOLD' || status === 'UNSOLD') && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onNext}
                  className="w-full py-5 rounded-2xl font-black italic tracking-tighter uppercase text-xl bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  Next Player <ChevronRight className="w-6 h-6" />
                </motion.button>
              )}

              {/* Keyboard shortcut hint */}
              {status === 'BIDDING' && canBid && (
                <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest font-bold">
                  Press <span className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">SPACE</span> to bid
                </div>
              )}
              {(status === 'SOLD' || status === 'UNSOLD') && (
                <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest font-bold">
                  Press <span className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">ENTER</span> for next
                </div>
              )}
            </div>

            {/* Skip set */}
            <div className="mt-3 relative z-10 border-t border-white/10 pt-3">
              <button
                onClick={onSkipSet}
                className="w-full py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-white/[0.03] hover:bg-rose-500/15 hover:text-rose-400 text-zinc-500 border border-transparent hover:border-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                Skip Remaining Set <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Paddle-raise strip */}
          <BiddingWar
            highestBidder={highestBidder}
            userFranchise={userFranchise}
            aiTeams={aiTeams}
            currentBid={currentBid}
            bidCount={bidCount}
            onBid={onBid}
            canBid={canBid}
            status={status}
          />
        </div>

        {/* RIGHT: Leaderboard */}
        <Leaderboard
          logs={logs}
          aiTeams={aiTeams}
          userFranchise={userFranchise}
          userPurse={userPurse}
          userTeam={userTeam}
          salesLog={salesLog}
        />
      </div>
    </>
  );
}
