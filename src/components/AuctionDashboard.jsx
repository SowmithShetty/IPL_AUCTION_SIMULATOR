import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ChevronRight, Users, Radio } from 'lucide-react';
import PlayerCard from './PlayerCard';
import BiddingWar from './BiddingWar';
import CountdownTimer from './CountdownTimer';
import GavelAnimation from './GavelAnimation';
import Leaderboard from './Leaderboard';
import { getNextBid, getDealEvaluation } from '../engine/auctionLogic';
import { TEAM_DATA } from '../data/teams';

export default function AuctionDashboard({
  player, currentBid, highestBidder, status, logs, userPurse,
  onStart, onBid, onNext, poolRemaining, userFranchise, userTeam,
  onSkipSet, aiTeams, bidCount, salesLog, onResolve,
  onGoingOnce, onGoingTwice,
}) {
  const isHighest = highestBidder === 'USER';
  const canAfford = userPurse >= getNextBid(currentBid);
  const overseasCount = userTeam.filter(p => p.isOverseas).length;
  const isOverseasLimitReached = player.isOverseas && overseasCount >= 8;
  const canBid = !isHighest && canAfford && !isOverseasLimitReached && status === 'BIDDING';

  const [showGavel, setShowGavel] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownResetKey = useRef(0);

  // Get highest bidder team accent
  const getTeamAccent = (bidder) => {
    if (!bidder) return '#10b981';
    if (bidder === 'USER') return TEAM_DATA[userFranchise]?.accent || '#10b981';
    return TEAM_DATA[bidder]?.accent || '#7c3aed';
  };

  const bidderAccent = getTeamAccent(highestBidder);
  const bidderDisplayName = highestBidder === 'USER' ? userFranchise : highestBidder;
  const bidderTeamData = TEAM_DATA[bidderDisplayName];

  // Reset countdown whenever a new bid comes in
  useEffect(() => {
    if (status === 'BIDDING' && highestBidder) {
      setCountdownActive(false);
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

  // Determine bid button style
  const getBidButtonStyle = () => {
    if (isHighest) {
      return {
        className: 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-400 border border-amber-500/20 cursor-default',
        text: '✓ Holding Lead',
        glow: '',
      };
    }
    if (isOverseasLimitReached) {
      return {
        className: 'bg-rose-950/30 text-rose-500 cursor-not-allowed border border-rose-900/40',
        text: '🚫 Max 8 Overseas',
        glow: '',
      };
    }
    if (!canAfford) {
      return {
        className: 'bg-rose-950/30 text-rose-500 cursor-not-allowed border border-rose-900/40',
        text: '🚫 Insufficient Funds',
        glow: '',
      };
    }
    return {
      className: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black bid-breathe',
      text: `🏏 Bid ₹${getNextBid(currentBid).toFixed(2)} Cr`,
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.4)]',
    };
  };

  const bidBtn = getBidButtonStyle();

  return (
    <>
      <GavelAnimation
        show={showGavel}
        onComplete={() => setShowGavel(false)}
        teamAccent={bidderAccent}
        playerName={player.name}
        price={currentBid.toFixed(2)}
      />

      <div className="p-3 md:p-5 lg:p-6 max-w-[1600px] w-full mx-auto lg:h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-4 lg:gap-5 z-10 relative items-stretch pb-8 overflow-hidden">

        {/* LEFT: Player Card */}
        <div className="w-full lg:w-[30%] flex flex-col justify-center items-center gap-3 lg:h-full">
          {/* Live + Remaining badge */}
          <div className="flex items-center gap-3 shrink-0">
            {/* LIVE indicator */}
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-rose-500 live-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 font-display">Live</span>
            </div>

            {/* Remaining counter */}
            <div className="flex items-center gap-1.5 bg-emerald-500/8 border border-emerald-500/15 px-3 py-1.5 rounded-full">
              <Users className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 font-display">
                <span className="text-white tabular-nums">{poolRemaining}</span> left
              </span>
            </div>
          </div>

          {/* Set banner */}
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 font-display text-center">
            {player.setName}
          </div>

          <PlayerCard
            player={player}
            status={status}
            currentBid={currentBid}
            getDealEvaluation={getDealEvaluation}
          />
        </div>

        {/* CENTER: Bidding Control */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center gap-4 lg:h-full">
          <div className="glass-panel rounded-2xl p-5 md:p-7 text-center shadow-2xl relative overflow-hidden">
            {/* Subtle scanline */}
            <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none rounded-2xl" />

            {/* Active Bid Header */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <DollarSign className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[10px] font-display font-black text-zinc-500 uppercase tracking-[0.2em]">
                Active Bid
              </span>
            </div>

            {/* Bid Amount — MASSIVE with roll-up effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBid}
                initial={{ y: 30, opacity: 0, scale: 1.1 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`font-display font-black italic tracking-tighter text-white mb-3 tabular-nums leading-none ${
                  currentBid >= 15 ? 'text-6xl md:text-7xl lg:text-8xl' :
                  currentBid >= 10 ? 'text-6xl md:text-7xl' :
                  'text-5xl md:text-6xl lg:text-7xl'
                }`}
                style={{
                  color: currentBid >= 15 ? '#f59e0b' : currentBid >= 10 ? '#f87171' : '#ffffff',
                  textShadow: currentBid >= 10
                    ? `0 0 40px ${currentBid >= 15 ? 'rgba(245,158,11,0.4)' : 'rgba(248,113,113,0.3)'}`
                    : 'none',
                }}
              >
                ₹{currentBid.toFixed(2)}
                <span className="text-xl md:text-2xl text-zinc-600 ml-1">Cr</span>
              </motion.div>
            </AnimatePresence>

            {/* Highest bidder — team-colored badge */}
            <div className="h-10 flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                {highestBidder ? (
                  <motion.div
                    key={highestBidder}
                    initial={{ y: 12, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black uppercase tracking-widest"
                    style={{
                      background: `${bidderAccent}15`,
                      border: `1px solid ${bidderAccent}40`,
                      color: bidderAccent,
                      boxShadow: `0 0 20px ${bidderAccent}15`,
                    }}
                  >
                    {bidderTeamData?.icon && (
                      <bidderTeamData.icon className="w-3.5 h-3.5" style={{ color: bidderAccent }} />
                    )}
                    {highestBidder === 'USER' ? `👑 ${userFranchise}` : `🏏 ${highestBidder}`}
                  </motion.div>
                ) : (
                  <motion.span
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-zinc-600 text-[10px] font-display font-black uppercase tracking-[0.2em]"
                  >
                    Awaiting First Bid...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Countdown Timer */}
            {status === 'BIDDING' && highestBidder && (
              <div className="flex justify-center mb-4">
                <CountdownTimer
                  key={countdownResetKey.current}
                  isActive={countdownActive}
                  duration={5}
                  onExpire={handleCountdownExpire}
                  onGoingOnce={onGoingOnce}
                  onGoingTwice={onGoingTwice}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 relative z-10">
              {status === 'WAITING' && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onStart}
                  className="w-full py-5 rounded-xl font-display font-black italic tracking-tighter uppercase text-2xl bg-white text-black hover:bg-zinc-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] shimmer"
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
                  className={`w-full py-5 md:py-6 rounded-xl font-display font-black italic tracking-tighter uppercase text-xl md:text-2xl transition-all ${bidBtn.className} ${bidBtn.glow}`}
                >
                  {bidBtn.text}
                </motion.button>
              )}

              {(status === 'SOLD' || status === 'UNSOLD') && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onNext}
                  className="w-full py-5 rounded-xl font-display font-black italic tracking-tighter uppercase text-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  Next Player <ChevronRight className="w-6 h-6" />
                </motion.button>
              )}

              {/* Keyboard hints */}
              {status === 'BIDDING' && canBid && (
                <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest font-bold font-display">
                  Press <span className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">SPACE</span> to bid
                </div>
              )}
              {(status === 'SOLD' || status === 'UNSOLD') && (
                <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest font-bold font-display">
                  Press <span className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">ENTER</span> for next
                </div>
              )}
            </div>

            {/* Skip Set */}
            <div className="mt-3 relative z-10 border-t border-white/[0.06] pt-3">
              <button
                onClick={onSkipSet}
                className="w-full py-2.5 rounded-lg font-display font-bold uppercase tracking-widest text-[10px] bg-white/[0.02] hover:bg-rose-500/10 hover:text-rose-400 text-zinc-600 border border-transparent hover:border-rose-500/15 transition-all flex items-center justify-center gap-2"
              >
                Skip Remaining Set <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Paddle Visualization */}
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
