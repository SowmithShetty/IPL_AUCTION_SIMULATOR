import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart3, Trophy } from 'lucide-react';
import { TEAM_DATA } from '../data/teams';

/**
 * Leaderboard — Tabbed sidebar with Live Feed, Franchise War Room, and Top Buys.
 */
export default function Leaderboard({ logs, aiTeams, userFranchise, userPurse, userTeam, salesLog }) {
  const [activeTab, setActiveTab] = useState('feed');

  const tabs = [
    { id: 'feed', label: 'Live', icon: Activity },
    { id: 'teams', label: 'Teams', icon: BarChart3 },
    { id: 'top', label: 'Top', icon: Trophy },
  ];

  // Build all-teams data for the war room
  const allTeamsData = [
    {
      name: userFranchise,
      shortName: TEAM_DATA[userFranchise]?.shortName || '???',
      purse: userPurse,
      playerCount: userTeam.length,
      overseasCount: userTeam.filter(p => p.isOverseas).length,
      spent: 100 - userPurse,
      accent: TEAM_DATA[userFranchise]?.accent || '#10b981',
      isUser: true,
    },
    ...aiTeams.map(t => ({
      name: t.name,
      shortName: TEAM_DATA[t.name]?.shortName || '???',
      purse: t.purse,
      playerCount: t.roster.length,
      overseasCount: t.roster.filter(p => p.isOverseas).length,
      spent: 100 - t.purse,
      accent: TEAM_DATA[t.name]?.accent || '#888',
      isUser: false,
    }))
  ].sort((a, b) => b.spent - a.spent);

  // Top buys
  const topBuys = [...salesLog]
    .filter(s => s.type === 'sold')
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  return (
    <div className="w-full lg:w-[28%] flex flex-col h-[450px] lg:h-full border border-white/10 rounded-[2rem] bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl shrink-0">
      {/* Tab headers */}
      <div className="bg-white/5 border-b border-white/10 p-2 flex gap-1 shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-2 font-mono text-xs"
            >
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10, x: -5 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    className={`p-2.5 rounded-lg border-l-4 text-[11px] ${
                      log.type === 'success' ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300' :
                      log.type === 'error' ? 'bg-rose-950/20 border-rose-500 text-rose-300' :
                      log.type === 'warning' ? 'bg-violet-950/20 border-violet-500 text-violet-300' :
                      'bg-white/[0.03] border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <span className="opacity-30 text-[9px] mr-1.5">▸</span> {log.message}
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <div className="text-center text-zinc-600 text-[10px] uppercase tracking-widest font-bold py-8">
                  Awaiting auction feed...
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-1.5"
            >
              {allTeamsData.map((team, idx) => (
                <div
                  key={team.name}
                  className={`p-2.5 rounded-lg border ${
                    team.isUser
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-white/[0.02] border-white/5'
                  } flex items-center gap-2`}
                >
                  <span className="text-[9px] font-black text-zinc-600 w-4">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${team.isUser ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {team.shortName} {team.isUser && '(YOU)'}
                      </span>
                      <span className={`text-[10px] font-black tabular-nums ${team.purse < 15 ? 'text-rose-400' : 'text-zinc-400'}`}>
                        ₹{team.purse.toFixed(1)}Cr
                      </span>
                    </div>
                    {/* Spending bar */}
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: team.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, team.spent)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[8px] text-zinc-600 font-bold">
                        {team.playerCount} players
                      </span>
                      <span className="text-[8px] text-zinc-600 font-bold">
                        {team.overseasCount}/8 OS
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'top' && (
            <motion.div
              key="top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-1.5"
            >
              {topBuys.length === 0 && (
                <div className="text-center text-zinc-600 text-[10px] uppercase tracking-widest font-bold py-8">
                  No sales yet...
                </div>
              )}
              {topBuys.map((sale, idx) => (
                <div key={sale.id || idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2">
                  <span className={`text-sm font-black w-6 text-center ${
                    idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-amber-700' : 'text-zinc-600'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-white truncate">{sale.playerName}</div>
                    <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">{sale.buyer}</div>
                  </div>
                  <span className="text-[11px] font-black text-emerald-400 tabular-nums">₹{sale.price.toFixed(2)}Cr</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
