import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Fingerprint, Shield, Database, Volume2, VolumeX } from 'lucide-react';

import ThreeBackground from './components/ThreeBackground';
import TeamSelection from './components/TeamSelection';
import RetentionPhase from './components/RetentionPhase';
import AuctionDashboard from './components/AuctionDashboard';
import SummaryPhase from './components/SummaryPhase';
import PoolModal from './components/PoolModal';
import SquadModal from './components/SquadModal';
import LiveTicker from './components/LiveTicker';

import { TEAM_DATA } from './data/teams';
import { generateMassivePool, enrichPlayer } from './data/players';
import { getNextBid } from './engine/auctionLogic';
import { getNextAIBidder } from './engine/aiStrategy';
import { soundEngine, speakText, getAuctioneerLine } from './engine/soundEngine';

// Generate the auction pool once
const existingNames = new Set();
Object.values(TEAM_DATA).forEach(team => {
  team.squad.forEach(p => existingNames.add(p.name));
});
const AUCTION_POOL = generateMassivePool(existingNames).map(enrichPlayer);

export default function App() {
  const [phase, setPhase] = useState('TEAM_SELECTION');
  const [userFranchise, setUserFranchise] = useState(null);
  const [userPurse, setUserPurse] = useState(100.0);
  const [userTeam, setUserTeam] = useState([]);
  const [aiTeams, setAiTeams] = useState([]);

  const [availablePlayers, setAvailablePlayers] = useState([...AUCTION_POOL]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState('WAITING');
  const [logs, setLogs] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bidCount, setBidCount] = useState(0);
  const [salesLog, setSalesLog] = useState([]);

  const [showPoolModal, setShowPoolModal] = useState(false);
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [poolTracker, setPoolTracker] = useState([...AUCTION_POOL]);

  const hammerTimerRef = useRef(null);
  const aiTimerRef = useRef(null);

  // Initialize sound engine on first interaction
  useEffect(() => {
    const initSound = () => {
      soundEngine.init();
      soundEngine.startAmbient();
      document.removeEventListener('click', initSound);
    };
    document.addEventListener('click', initSound);
    return () => {
      document.removeEventListener('click', initSound);
      soundEngine.destroy();
    };
  }, []);

  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // History API for modal back-button
  const handleOpenSquad = () => {
    try { window.history.pushState({ modal: 'squad' }, ''); } catch(e) {}
    setShowSquadModal(true);
  };
  const handleCloseSquad = () => {
    setShowSquadModal(false);
    try { if (window.history.state?.modal === 'squad') window.history.back(); } catch(e) {}
  };
  const handleOpenPool = () => {
    try { window.history.pushState({ modal: 'pool' }, ''); } catch(e) {}
    setShowPoolModal(true);
  };
  const handleClosePool = () => {
    setShowPoolModal(false);
    try { if (window.history.state?.modal === 'pool') window.history.back(); } catch(e) {}
  };

  useEffect(() => {
    const handlePopState = () => {
      setShowPoolModal(false);
      setShowSquadModal(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), message, type }, ...prev].slice(0, 12));
  };

  const doSpeak = useCallback((text) => {
    speakText(text, soundEnabled);
  }, [soundEnabled]);

  // --- TEAM SELECTION ---
  const handleTeamSelection = (teamName) => {
    setUserFranchise(teamName);
    const otherTeams = Object.keys(TEAM_DATA).filter(name => name !== teamName);
    setAiTeams(otherTeams.map(name => ({ name, purse: 100.0, roster: [] })));
    setPhase('RETENTION');
    doSpeak(`Welcome to ${teamName}. Please select your retentions from the squad.`);
  };

  // --- RETENTION COMPLETE ---
  const handleCompleteRetention = (retainedPlayers, totalCost) => {
    setUserTeam(retainedPlayers);
    setUserPurse(100.0 - totalCost);
    setCurrentPlayer(availablePlayers[0]);
    setCurrentBid(availablePlayers[0].basePrice);
    setPhase('AUCTION');
    setBidCount(0);
    addLog('Auction initiated. Welcome, Manager.', 'system');
    addLog(`First up: ${availablePlayers[0].name}.`, 'system');
    doSpeak(getAuctioneerLine('playerIntro', availablePlayers[0].name, availablePlayers[0].basePrice, availablePlayers[0].setName));
    soundEngine.playReveal();
  };

  // --- AI BIDDING ENGINE ---
  useEffect(() => {
    if (phase !== 'AUCTION' || auctionStatus !== 'BIDDING' || !currentPlayer) return;

    // Slower AI delay (2.8s to 4.2s with bid, 3.2s to 4.7s without bid) to let the timer count down
    const aiDelay = highestBidder 
      ? 2800 + Math.random() * 1400 
      : 3200 + Math.random() * 1500;

    aiTimerRef.current = setTimeout(() => {
      const bidderName = getNextAIBidder(currentPlayer, currentBid, highestBidder, aiTeams, getNextBid);
      if (bidderName) {
        handleBid(bidderName);
      }
    }, aiDelay);

    return () => {
      clearTimeout(aiTimerRef.current);
    };
  }, [currentBid, highestBidder, auctionStatus, phase, currentPlayer]);

  // --- HANDLE BID ---
  const handleBid = useCallback((bidder) => {
    if (auctionStatus !== 'BIDDING') return;

    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    const nextBid = currentBid === currentPlayer.basePrice && !highestBidder ? currentBid : getNextBid(currentBid);
    if (bidder === 'USER' && userPurse < nextBid) {
      addLog('Insufficient funds!', 'error');
      doSpeak('Insufficient funds.');
      return;
    }

    // Overseas limit check for user
    if (bidder === 'USER' && currentPlayer.isOverseas) {
      const overseasCount = userTeam.filter(p => p.isOverseas).length;
      if (overseasCount >= 8) {
        addLog('Maximum overseas players reached!', 'error');
        return;
      }
    }

    setCurrentBid(nextBid);
    setHighestBidder(bidder);
    setBidCount(prev => {
      const newCount = prev + 1;

      // Play escalating bid sound
      soundEngine.playBidEscalate(newCount);

      // Bidding war commentary
      if (newCount === 4) {
        doSpeak(getAuctioneerLine('biddingWar'));
      }

      return newCount;
    });

    const isUser = bidder === 'USER';
    const displayName = isUser ? userFranchise : bidder;

    addLog(`${displayName} bid ₹${nextBid.toFixed(2)} Cr`, isUser ? 'success' : 'warning');
    doSpeak(getAuctioneerLine('bidRaise', displayName, nextBid.toFixed(2)));
  }, [auctionStatus, currentBid, currentPlayer, highestBidder, userPurse, userTeam, userFranchise, doSpeak]);

  // --- RESOLVE PLAYER ---
  const resolvePlayer = useCallback(() => {
    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    const updateTrackerStatus = (status, buyer, price) => {
      setPoolTracker(prev => prev.map(p => p.id === currentPlayer.id ? { ...p, status, boughtBy: buyer, price } : p));
    };

    if (!highestBidder) {
      setAuctionStatus('UNSOLD');
      updateTrackerStatus('UNSOLD', null, null);
      addLog(`${currentPlayer.name} went UNSOLD.`, 'error');
      doSpeak(getAuctioneerLine('unsold', currentPlayer.name));
      soundEngine.playUnsold();
      setSalesLog(prev => [...prev, {
        type: 'unsold',
        playerName: currentPlayer.name,
        role: currentPlayer.role,
      }]);
    } else if (highestBidder === 'USER') {
      setAuctionStatus('SOLD');
      setUserTeam(prev => [...prev, { ...currentPlayer, boughtFor: currentBid }]);
      setUserPurse(prev => prev - currentBid);
      updateTrackerStatus('SOLD', userFranchise, currentBid);
      addLog(`${currentPlayer.name} sold to ${userFranchise} for ₹${currentBid.toFixed(2)} Cr!`, 'success');

      const isBigBuy = currentBid >= 10;
      doSpeak(isBigBuy
        ? getAuctioneerLine('soldBig', currentPlayer.name, userFranchise, currentBid.toFixed(2))
        : getAuctioneerLine('sold', currentPlayer.name, userFranchise, currentBid.toFixed(2))
      );
      soundEngine.playGavel();
      if (isBigBuy) setTimeout(() => soundEngine.playCrowdCheer(), 600);

      setSalesLog(prev => [...prev, {
        type: 'sold',
        playerName: currentPlayer.name,
        buyer: userFranchise,
        price: currentBid,
        role: currentPlayer.role,
        rating: currentPlayer.rating,
        basePrice: currentPlayer.basePrice,
      }]);
    } else {
      setAuctionStatus('SOLD');
      setAiTeams(prev => prev.map(t =>
        t.name === highestBidder
          ? { ...t, purse: t.purse - currentBid, roster: [...t.roster, { ...currentPlayer, boughtFor: currentBid }] }
          : t
      ));
      updateTrackerStatus('SOLD', highestBidder, currentBid);
      addLog(`${currentPlayer.name} sold to ${highestBidder} for ₹${currentBid.toFixed(2)} Cr.`, 'system');

      const isBigBuy = currentBid >= 10;
      doSpeak(isBigBuy
        ? getAuctioneerLine('soldBig', currentPlayer.name, highestBidder, currentBid.toFixed(2))
        : getAuctioneerLine('sold', currentPlayer.name, highestBidder, currentBid.toFixed(2))
      );
      soundEngine.playGavel();
      if (isBigBuy) setTimeout(() => soundEngine.playCrowdCheer(), 600);

      setSalesLog(prev => [...prev, {
        type: 'sold',
        playerName: currentPlayer.name,
        buyer: highestBidder,
        price: currentBid,
        role: currentPlayer.role,
        rating: currentPlayer.rating,
        basePrice: currentPlayer.basePrice,
      }]);
    }
  }, [currentPlayer, highestBidder, currentBid, userFranchise, doSpeak]);

  // --- GOING ONCE / TWICE COMMENTARY CUES ---
  const handleGoingOnce = useCallback(() => {
    const displayName = highestBidder === 'USER' ? userFranchise : highestBidder;
    if (displayName) {
      doSpeak(getAuctioneerLine('goingOnce', displayName, currentBid.toFixed(2)));
    }
  }, [highestBidder, userFranchise, currentBid, doSpeak]);

  const handleGoingTwice = useCallback(() => {
    const displayName = highestBidder === 'USER' ? userFranchise : highestBidder;
    if (displayName) {
      doSpeak(getAuctioneerLine('goingTwice', displayName, currentBid.toFixed(2)));
    }
  }, [highestBidder, userFranchise, currentBid, doSpeak]);

  // --- NEXT PLAYER ---
  const nextPlayer = () => {
    const nextPool = availablePlayers.slice(1);
    setAvailablePlayers(nextPool);
    if (nextPool.length === 0) {
      setPhase('SUMMARY');
      soundEngine.stopAmbient();
      doSpeak("The auction has concluded. Let's see the final results.");
    } else {
      const next = nextPool[0];
      const currentSetId = currentPlayer?.setId;

      setCurrentPlayer(next);
      setCurrentBid(next.basePrice);
      setHighestBidder(null);
      setAuctionStatus('BIDDING');
      setBidCount(0);

      // Set change announcement
      if (currentSetId && next.setId !== currentSetId) {
        addLog(`Moving to ${next.setName}`, 'system');
        doSpeak(getAuctioneerLine('setChange', next.setName));
        setTimeout(() => {
          doSpeak(getAuctioneerLine('playerIntro', next.name, next.basePrice, next.setName));
        }, 2500);
      } else {
        addLog(`Next: ${next.name}`, 'system');
        doSpeak(getAuctioneerLine('playerIntro', next.name, next.basePrice, next.setName));
      }

      soundEngine.playReveal();
    }
  };

  // --- SKIP SET ---
  const handleSkipSet = () => {
    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    const currentSetId = currentPlayer.setId;

    setPoolTracker(prev => prev.map(p =>
      (p.setId === currentSetId && p.status === 'AVAILABLE') ? { ...p, status: 'SKIPPED' } : p
    ));

    const nextSetPlayers = availablePlayers.filter(p => p.setId > currentSetId);
    setAvailablePlayers(nextSetPlayers);

    if (nextSetPlayers.length === 0) {
      setPhase('SUMMARY');
      soundEngine.stopAmbient();
      doSpeak("The auction has concluded.");
    } else {
      const next = nextSetPlayers[0];
      setCurrentPlayer(next);
      setCurrentBid(next.basePrice);
      setHighestBidder(null);
      setAuctionStatus('BIDDING');
      setBidCount(0);
      addLog(`Skipped to ${next.setName}.`, 'system');
      doSpeak(getAuctioneerLine('setChange', next.setName));
      soundEngine.playReveal();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col relative">
      <ThreeBackground />

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-3 md:p-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            <Fingerprint className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase">
              IPL Mega Auction
            </h1>
            <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] hidden md:block">
              Live Auction Simulator
            </div>
          </div>
        </div>

        {phase !== 'SUMMARY' && phase !== 'TEAM_SELECTION' && (
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex gap-1.5 md:gap-2 border-r border-white/10 pr-3 md:pr-6 mr-1 md:mr-2">
              <button onClick={handleOpenSquad} className="p-1.5 md:p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 text-[10px] md:text-sm font-bold text-zinc-300">
                <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" /> <span className="hidden md:inline">My Squad</span>
              </button>
              <button onClick={handleOpenPool} className="p-1.5 md:p-2 bg-rose-500/10 rounded-full border border-rose-500/30 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 text-[10px] md:text-sm font-bold text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.15)]">
                <Database className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400" /> <span className="hidden md:inline">Intel</span>
              </button>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1.5 md:p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors" title={soundEnabled ? "Mute" : "Unmute"}>
                {soundEnabled ? <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" />}
              </button>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest font-black">Purse</span>
              <span className={`text-lg md:text-2xl font-black italic tracking-tighter tabular-nums ${userPurse < 10 ? 'text-rose-500' : 'text-emerald-400'}`}>
                ₹{userPurse.toFixed(2)} <span className="text-xs md:text-sm">Cr</span>
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none mix-blend-overlay" />

        {phase === 'TEAM_SELECTION' && <TeamSelection onSelect={handleTeamSelection} />}
        {phase === 'RETENTION' && userFranchise && (
          <RetentionPhase
            squad={TEAM_DATA[userFranchise].squad}
            onConfirm={handleCompleteRetention}
            franchiseName={userFranchise}
          />
        )}
        {phase === 'AUCTION' && currentPlayer && (
          <AuctionDashboard
            player={currentPlayer}
            currentBid={currentBid}
            highestBidder={highestBidder}
            status={auctionStatus}
            logs={logs}
            userPurse={userPurse}
            onStart={() => setAuctionStatus('BIDDING')}
            onBid={() => handleBid('USER')}
            onNext={nextPlayer}
            poolRemaining={availablePlayers.length}
            userFranchise={userFranchise}
            userTeam={userTeam}
            onSkipSet={handleSkipSet}
            aiTeams={aiTeams}
            bidCount={bidCount}
            salesLog={salesLog}
            onResolve={resolvePlayer}
            onGoingOnce={handleGoingOnce}
            onGoingTwice={handleGoingTwice}
          />
        )}
        {phase === 'SUMMARY' && (
          <SummaryPhase
            userTeam={userTeam}
            remainingPurse={userPurse}
            userFranchise={userFranchise}
            salesLog={salesLog}
            aiTeams={aiTeams}
          />
        )}

        <AnimatePresence>
          {showPoolModal && <PoolModal onClose={handleClosePool} poolData={poolTracker} />}
          {showSquadModal && <SquadModal onClose={handleCloseSquad} team={userTeam} franchiseName={userFranchise} purse={userPurse} />}
        </AnimatePresence>
      </main>

      {/* Live Ticker */}
      {phase === 'AUCTION' && salesLog.length > 0 && (
        <LiveTicker
          salesLog={salesLog}
          aiTeams={aiTeams}
          userFranchise={userFranchise}
          userPurse={userPurse}
        />
      )}
    </div>
  );
}
