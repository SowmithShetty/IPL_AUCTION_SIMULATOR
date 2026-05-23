import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BarChart3 } from 'lucide-react';
import { getDealEvaluation } from '../engine/auctionLogic';
import { TEAM_DATA } from '../data/teams';

export default function SummaryPhase({ userTeam, remainingPurse, userFranchise, salesLog, aiTeams }) {
  const [activeView, setActiveView] = useState('squad');
  const sortedSquad = [...userTeam].sort((a, b) => b.rating - a.rating);

  // Calculate auction awards
  const allSales = salesLog.filter(s => s.type === 'sold');
  const mostExpensive = [...allSales].sort((a, b) => b.price - a.price)[0];
  const cheapest = [...allSales].sort((a, b) => a.price - b.price)[0];

  // Best buy = highest rating to price ratio
  const bestBuy = [...allSales]
    .map(s => ({ ...s, value: (s.rating || 85) / Math.max(s.price, 0.3) }))
    .sort((a, b) => b.value - a.value)[0];

  // Most contested = highest final-to-base ratio
  const mostContested = [...allSales]
    .filter(s => s.basePrice > 0)
    .map(s => ({ ...s, ratio: s.price / s.basePrice }))
    .sort((a, b) => b.ratio - a.ratio)[0];

  // Overall stats
  const totalSpent = allSales.reduce((sum, s) => sum + s.price, 0);
  const avgPrice = allSales.length > 0 ? totalSpent / allSales.length : 0;
  const unsoldCount = salesLog.filter(s => s.type === 'unsold').length;

  // Team balance analysis
  const roleBreakdown = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
  userTeam.forEach(p => { if (roleBreakdown[p.role] !== undefined) roleBreakdown[p.role]++; });

  // All teams summary
  const allTeamsSummary = [
    { name: userFranchise, purse: remainingPurse, players: userTeam, isUser: true },
    ...aiTeams.map(t => ({ name: t.name, purse: t.purse, players: t.roster, isUser: false }))
  ].sort((a, b) => b.players.length - a.players.length);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto z-10 relative pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 md:mb-16 mt-4 md:mt-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Trophy className="w-16 md:w-20 h-16 md:h-20 text-amber-400 mx-auto mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-2">Auction Complete</h2>
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Final results are in. Here's how you did.</p>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16 max-w-4xl mx-auto">
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
        className="mb-10 md:mb-16"
      >
        <h3 className="text-xl md:text-2xl font-black italic tracking-tighter text-white mb-6 border-b border-white/10 pb-3 uppercase flex items-center gap-2">
          🏆 Auction Awards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {mostExpensive && (
            <AwardCard
              title="💰 Most Expensive"
              player={mostExpensive.playerName}
              detail={`₹${mostExpensive.price.toFixed(2)} Cr → ${mostExpensive.buyer}`}
              color="from-amber-500/10 to-amber-500/5"
              borderColor="border-amber-500/20"
            />
          )}
          {bestBuy && (
            <AwardCard
              title="🔥 Best Value"
              player={bestBuy.playerName}
              detail={`₹${bestBuy.price.toFixed(2)} Cr → ${bestBuy.buyer}`}
              color="from-emerald-500/10 to-emerald-500/5"
              borderColor="border-emerald-500/20"
            />
          )}
          {mostContested && (
            <AwardCard
              title="⚔️ Most Contested"
              player={mostContested.playerName}
              detail={`${mostContested.ratio.toFixed(1)}x base price`}
              color="from-rose-500/10 to-rose-500/5"
              borderColor="border-rose-500/20"
            />
          )}
          <AwardCard
            title="📊 Auction Stats"
            player={`${allSales.length} sold, ${unsoldCount} unsold`}
            detail={`Avg price: ₹${avgPrice.toFixed(2)} Cr`}
            color="from-violet-500/10 to-violet-500/5"
            borderColor="border-violet-500/20"
          />
        </div>
      </motion.div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveView('squad')}
          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            activeView === 'squad' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          Your Squad
        </button>
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            activeView === 'all' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          All Franchises
        </button>
      </div>

      {activeView === 'squad' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Squad Balance */}
          <div className="mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-wrap gap-4 items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Squad Balance:</span>
            {Object.entries(roleBreakdown).map(([role, count]) => (
              <div key={role} className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-zinc-400">{role}</span>
                <div className="h-2 bg-white/5 rounded-full w-16 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, count * 15)}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-white tabular-nums">{count}</span>
              </div>
            ))}
          </div>

          {/* Squad cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedSquad.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 md:p-5 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${!player.isRetained ? 'bg-emerald-500' : 'bg-violet-500'}`} />
                <div className="font-black italic text-base md:text-lg text-white tracking-tight pl-2 break-words">
                  {player.flag} {player.name}
                </div>
                <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mb-3 pl-2 flex flex-wrap items-center gap-1.5">
                  {player.style} <span className="text-zinc-700">•</span>
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase text-zinc-300">{player.countryName}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-2 pl-2">
                  <span className="text-[9px] bg-black/50 px-2 py-1 rounded font-black uppercase tracking-widest text-zinc-400 border border-white/10">{player.role}</span>
                  {!player.isRetained ? (
                    <div className="text-xs text-emerald-400 font-black italic tracking-tighter">₹{player.boughtFor?.toFixed(2)}Cr</div>
                  ) : (
                    <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest">🔒 ₹{player.boughtFor?.toFixed(2)}Cr</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeView === 'all' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {allTeamsSummary.map((team, idx) => {
            const teamData = TEAM_DATA[team.name];
            return (
              <div key={team.name} className={`p-4 rounded-2xl border ${team.isUser ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-zinc-500 w-6">{idx + 1}</span>
                    <span className={`font-black italic text-lg tracking-tight ${team.isUser ? 'text-emerald-400' : 'text-white'}`}>
                      {team.name} {team.isUser && '(YOU)'}
                    </span>
                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-zinc-500 font-black uppercase tracking-wider">
                      {teamData?.shortName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-black tabular-nums ${team.purse < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ₹{team.purse.toFixed(1)}Cr left
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                  <span>{team.players.length} players</span>
                  <span>•</span>
                  <span>{team.players.filter(p => p.isOverseas).length}/8 overseas</span>
                  <span>•</span>
                  <span>₹{(100 - team.purse).toFixed(1)}Cr spent</span>
                </div>
                {/* Spending bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, 100 - team.purse)}%`,
                      backgroundColor: teamData?.accent || '#888',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] backdrop-blur-md p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 text-center"
    >
      <div className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1.5">{label}</div>
      <div className={`text-3xl md:text-4xl font-black italic tracking-tighter ${color}`}>{value}</div>
      <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mt-1">{sub}</div>
    </motion.div>
  );
}

function AwardCard({ title, player, detail, color, borderColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${color} border ${borderColor} rounded-2xl p-4 md:p-5`}
    >
      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{title}</div>
      <div className="font-black italic text-base md:text-lg text-white tracking-tight break-words">{player}</div>
      <div className="text-[10px] text-zinc-400 font-bold mt-1 break-words">{detail}</div>
    </motion.div>
  );
}
