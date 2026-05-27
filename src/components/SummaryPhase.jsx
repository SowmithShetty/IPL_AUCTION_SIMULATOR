import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BarChart3, RotateCcw } from 'lucide-react';
import { getDealEvaluation } from '../engine/auctionLogic';
import { TEAM_DATA } from '../data/teams';

// Manager Rating Calculator
function calculateManagerRating(userTeam, remainingPurse) {
  if (userTeam.length === 0) return { grade: 'D', label: 'No Picks', color: 'text-zinc-500' };

  const avgRating = userTeam.reduce((s, p) => s + (p.rating || 0), 0) / userTeam.length;
  const overseasCount = userTeam.filter(p => p.isOverseas).length;
  const roleBreakdown = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
  userTeam.forEach(p => { if (roleBreakdown[p.role] !== undefined) roleBreakdown[p.role]++; });

  let score = 0;

  // Squad quality (0-35)
  score += Math.min(35, (avgRating - 75) * 2);

  // Squad size (0-20)
  if (userTeam.length >= 18) score += 20;
  else if (userTeam.length >= 14) score += 15;
  else if (userTeam.length >= 10) score += 10;
  else score += userTeam.length * 0.8;

  // Balance (0-20) — penalize if any role is missing
  const hasAllRoles = Object.values(roleBreakdown).every(v => v >= 1);
  if (hasAllRoles) score += 10;
  const hasGoodBalance = roleBreakdown.BAT >= 3 && roleBreakdown.BOWL >= 3 && roleBreakdown.AR >= 2 && roleBreakdown.WK >= 1;
  if (hasGoodBalance) score += 10;

  // Money management (0-15)
  if (remainingPurse >= 3 && remainingPurse <= 20) score += 15;
  else if (remainingPurse < 3) score += 8;
  else score += Math.max(0, 15 - (remainingPurse - 20) * 0.3);

  // Overseas utilization (0-10)
  if (overseasCount >= 4 && overseasCount <= 8) score += 10;
  else score += overseasCount * 1.5;

  if (score >= 85) return { grade: 'S', label: 'LEGENDARY', color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-500/5' };
  if (score >= 70) return { grade: 'A', label: 'EXCELLENT', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-500/5' };
  if (score >= 55) return { grade: 'B', label: 'SOLID', color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-500/5' };
  if (score >= 40) return { grade: 'C', label: 'AVERAGE', color: 'text-zinc-400', bg: 'from-zinc-500/20 to-zinc-500/5' };
  return { grade: 'D', label: 'POOR', color: 'text-rose-400', bg: 'from-rose-500/20 to-rose-500/5' };
}

export default function SummaryPhase({ userTeam, remainingPurse, userFranchise, salesLog, aiTeams }) {
  const [activeView, setActiveView] = useState('squad');
  const sortedSquad = [...userTeam].sort((a, b) => b.rating - a.rating);

  const teamData = TEAM_DATA[userFranchise];
  const teamAccent = teamData?.accent || '#10b981';

  // Manager rating
  const managerRating = calculateManagerRating(userTeam, remainingPurse);

  // Auction awards
  const allSales = salesLog.filter(s => s.type === 'sold');
  const mostExpensive = [...allSales].sort((a, b) => b.price - a.price)[0];
  const cheapest = [...allSales].sort((a, b) => a.price - b.price)[0];

  const bestBuy = [...allSales]
    .map(s => ({ ...s, value: (s.rating || 85) / Math.max(s.price, 0.3) }))
    .sort((a, b) => b.value - a.value)[0];

  const mostContested = [...allSales]
    .filter(s => s.basePrice > 0)
    .map(s => ({ ...s, ratio: s.price / s.basePrice }))
    .sort((a, b) => b.ratio - a.ratio)[0];

  const totalSpent = allSales.reduce((sum, s) => sum + s.price, 0);
  const avgPrice = allSales.length > 0 ? totalSpent / allSales.length : 0;
  const unsoldCount = salesLog.filter(s => s.type === 'unsold').length;

  // Role breakdown
  const roleBreakdown = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
  userTeam.forEach(p => { if (roleBreakdown[p.role] !== undefined) roleBreakdown[p.role]++; });

  // All teams summary
  const allTeamsSummary = [
    { name: userFranchise, purse: remainingPurse, players: userTeam, isUser: true },
    ...aiTeams.map(t => ({ name: t.name, purse: t.purse, players: t.roster, isUser: false }))
  ].sort((a, b) => b.players.length - a.players.length);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto z-10 relative pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12 mt-4 md:mt-8"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <Trophy className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 md:mb-6"
            style={{
              color: '#f59e0b',
              filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.4))',
            }}
          />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-display font-black italic text-white uppercase tracking-tighter mb-2">
          Auction Complete
        </h2>
        <p className="text-zinc-500 font-display font-bold uppercase tracking-widest text-sm">
          Final results are in. Here's how you did.
        </p>
      </motion.div>

      {/* Manager Rating — THE HIGHLIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className={`bg-gradient-to-br ${managerRating.bg} border rounded-2xl p-6 md:p-8 text-center mb-8 md:mb-12 max-w-md mx-auto`}
        style={{ borderColor: `${teamAccent}20` }}
      >
        <div className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">
          Manager Rating
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className={`text-8xl md:text-9xl font-display font-black italic ${managerRating.color} leading-none mb-2`}
          style={{ textShadow: `0 0 40px currentColor` }}
        >
          {managerRating.grade}
        </motion.div>
        <div className={`text-sm font-display font-black uppercase tracking-[0.2em] ${managerRating.color}`}>
          {managerRating.label}
        </div>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-12 max-w-4xl mx-auto">
        <StatCard label="Remaining Purse" value={`₹${remainingPurse.toFixed(2)}`} sub="Crores" color="text-emerald-400" />
        <StatCard label="Squad Size" value={userTeam.length} sub="Players" color="text-white" />
        <StatCard label="Overseas" value={userTeam.filter(p => p.isOverseas).length} sub="of 8 max" color="text-amber-400" />
        <StatCard label="Avg Rating" value={userTeam.length > 0 ? (userTeam.reduce((s, p) => s + (p.rating || 0), 0) / userTeam.length).toFixed(0) : '—'} sub="OVR" color="text-violet-400" />
      </div>

      {/* Auction Awards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 md:mb-12"
      >
        <h3 className="text-xl md:text-2xl font-display font-black italic tracking-tighter text-white mb-5 border-b border-white/[0.06] pb-3 uppercase flex items-center gap-2">
          🏆 Auction Awards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {mostExpensive && (
            <AwardCard
              title="💰 Most Expensive"
              player={mostExpensive.playerName}
              detail={`₹${mostExpensive.price.toFixed(2)} Cr → ${mostExpensive.buyer}`}
              accent={TEAM_DATA[mostExpensive.buyer]?.accent || '#f59e0b'}
            />
          )}
          {bestBuy && (
            <AwardCard
              title="🔥 Best Value"
              player={bestBuy.playerName}
              detail={`₹${bestBuy.price.toFixed(2)} Cr → ${bestBuy.buyer}`}
              accent={TEAM_DATA[bestBuy.buyer]?.accent || '#10b981'}
            />
          )}
          {mostContested && (
            <AwardCard
              title="⚔️ Most Contested"
              player={mostContested.playerName}
              detail={`${mostContested.ratio.toFixed(1)}x base price`}
              accent="#ec4899"
            />
          )}
          <AwardCard
            title="📊 Auction Stats"
            player={`${allSales.length} sold, ${unsoldCount} unsold`}
            detail={`Avg price: ₹${avgPrice.toFixed(2)} Cr`}
            accent="#7c3aed"
          />
        </div>
      </motion.div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveView('squad')}
          className={`px-4 py-2 rounded-lg text-[10px] font-display font-black uppercase tracking-widest transition-all ${
            activeView === 'squad' ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20' : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
          }`}
        >
          Your Squad
        </button>
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2 rounded-lg text-[10px] font-display font-black uppercase tracking-widest transition-all ${
            activeView === 'all' ? 'bg-violet-500/12 text-violet-400 border border-violet-500/20' : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
          }`}
        >
          All Franchises
        </button>
      </div>

      {activeView === 'squad' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Squad Balance */}
          <div className="mb-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <span className="text-[10px] font-display font-black uppercase tracking-widest text-zinc-600">Squad Balance:</span>
            {Object.entries(roleBreakdown).map(([role, count]) => (
              <div key={role} className="flex items-center gap-2">
                <span className="text-[10px] font-display font-black uppercase text-zinc-400">{role}</span>
                <div className="h-1.5 bg-white/[0.04] rounded-full w-16 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, count * 15)}%`,
                      backgroundColor: teamAccent,
                    }}
                  />
                </div>
                <span className="text-[10px] font-display font-black text-white tabular-nums">{count}</span>
              </div>
            ))}
          </div>

          {/* Squad cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {sortedSquad.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-xl relative overflow-hidden hover:bg-white/[0.04] transition-colors"
              >
                {/* Acquisition type indicator */}
                <div className={`absolute top-0 left-0 w-1 h-full ${!player.isRetained ? 'bg-emerald-500' : 'bg-violet-500'}`} />

                {/* Acquisition badge */}
                <div className="absolute top-2 right-2">
                  <span className={`text-[7px] font-display font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    player.isRetained ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {player.isRetained ? '🔒 RTN' : '🏏 AUC'}
                  </span>
                </div>

                <div className="font-display font-black italic text-base text-white tracking-tight pl-2.5 pr-8 break-words">
                  {player.flag} {player.name}
                </div>
                <div className="text-[8px] text-zinc-500 uppercase font-display font-bold tracking-widest mb-2 pl-2.5 flex flex-wrap items-center gap-1">
                  {player.style}
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 pl-2.5">
                  <span className="text-[9px] bg-black/50 px-2 py-0.5 rounded font-display font-black uppercase tracking-widest text-zinc-400 border border-white/[0.06]">{player.role}</span>
                  <div className="text-sm font-display font-black italic tracking-tighter"
                    style={{ color: player.isRetained ? '#a78bfa' : '#10b981' }}
                  >
                    ₹{player.boughtFor?.toFixed(2)}Cr
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeView === 'all' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {allTeamsSummary.map((team, idx) => {
            const td = TEAM_DATA[team.name];
            const accent = td?.accent || '#888';
            return (
              <div
                key={team.name}
                className="p-4 rounded-xl border"
                style={{
                  background: team.isUser ? `${accent}08` : 'rgba(255,255,255,0.015)',
                  borderColor: team.isUser ? `${accent}20` : 'rgba(255,255,255,0.04)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-display font-black text-zinc-600 w-6">{idx + 1}</span>
                    <span className="font-display font-black italic text-lg tracking-tight"
                      style={{ color: team.isUser ? accent : '#ffffff' }}
                    >
                      {team.name} {team.isUser && '(YOU)'}
                    </span>
                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-zinc-500 font-display font-black uppercase tracking-wider">
                      {td?.shortName}
                    </span>
                  </div>
                  <span className={`text-sm font-display font-black tabular-nums ${team.purse < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ₹{team.purse.toFixed(1)}Cr left
                  </span>
                </div>
                <div className="flex gap-3 text-[9px] font-display font-bold uppercase tracking-wider text-zinc-600">
                  <span>{team.players.length} players</span>
                  <span>•</span>
                  <span>{team.players.filter(p => p.isOverseas).length}/8 overseas</span>
                  <span>•</span>
                  <span>₹{(100 - team.purse).toFixed(1)}Cr spent</span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, 100 - team.purse)}%`,
                      backgroundColor: accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Play Again */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-12"
      >
        <button
          onClick={handlePlayAgain}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-display font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] backdrop-blur-md p-4 md:p-5 rounded-xl border border-white/[0.06] text-center"
    >
      <div className="text-zinc-600 text-[9px] md:text-[10px] font-display font-black uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-3xl md:text-4xl font-display font-black italic tracking-tighter ${color}`}>{value}</div>
      <div className="text-[9px] text-zinc-700 uppercase tracking-widest font-display font-bold mt-0.5">{sub}</div>
    </motion.div>
  );
}

function AwardCard({ title, player, detail, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-4 md:p-5 border"
      style={{
        background: `linear-gradient(135deg, ${accent}10, ${accent}05)`,
        borderColor: `${accent}20`,
      }}
    >
      <div className="text-[10px] font-display font-black uppercase tracking-widest text-zinc-500 mb-2">{title}</div>
      <div className="font-display font-black italic text-base md:text-lg text-white tracking-tight break-words">{player}</div>
      <div className="text-[10px] text-zinc-400 font-display font-bold mt-1 break-words">{detail}</div>
    </motion.div>
  );
}
