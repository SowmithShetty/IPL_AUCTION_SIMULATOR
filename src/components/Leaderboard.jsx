import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart3, Trophy } from 'lucide-react';
import { TEAM_DATA } from '../data/teams';

/**
 * Leaderboard — Tabbed sidebar with Live Feed, Franchise War Room, and Top Buys.
 * Each team uses their authentic accent color.
 */
export default function Leaderboard({ logs, aiTeams, userFranchise, userPurse, userTeam, salesLog }) {
  const [activeTab, setActiveTab] = useState('feed');

  const tabs = [
    { id: 'feed', label: 'Live', icon: Activity },
    { id: 'teams', label: 'Teams', icon: BarChart3 },
    { id: 'top', label: 'Top', icon: Trophy },
  ];

  // Build all-teams data
  const allTeamsData = [
    {
      name: userFranchise,
      shortName: TEAM_DATA[userFranchise]?.shortName || '???',
      purse: userPurse,
      playerCount: userTeam.length,
      overseasCount: userTeam.filter(p => p.isOverseas).length,
      spent: 100 - userPurse,
      accent: TEAM_DATA[userFranchise]?.accent || '#10b981',
      icon: TEAM_DATA[userFranchise]?.icon,
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
      icon: TEAM_DATA[t.name]?.icon,
      isUser: false,
    }))
  ].sort((a, b) => b.spent - a.spent);

  // Top buys
  const topBuys = [...salesLog]
    .filter(s => s.type === 'sold')
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  const logIcons = {
    success: '✅',
    error: '❌',
    warning: '🏏',
    system: '📢',
  };

  return (
    <div className="w-full lg:w-[28%] flex flex-col h-[450px] lg:h-full border border-white/[0.06] rounded-2xl bg-black/50 backdrop-blur-md overflow-hidden shadow-2xl shrink-0">
      {/* Tab headers */}
      <div className="bg-white/[0.03] border-b border-white/[0.06] p-2 flex gap-1 shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[9px] font-display font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-600 hover:text-zinc-400 border border-transparent hover:bg-white/[0.03]'
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
          {/* LIVE FEED */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-1.5"
            >
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-2.5 rounded-lg border-l-[3px] text-[11px] font-mono flex items-start gap-2 ${
                      log.type === 'success' ? 'bg-emerald-950/15 border-emerald-500 text-emerald-300' :
                      log.type === 'error' ? 'bg-rose-950/15 border-rose-500 text-rose-300' :
                      log.type === 'warning' ? 'bg-violet-950/15 border-violet-500 text-violet-300' :
                      'bg-white/[0.02] border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <span className="text-[10px] shrink-0">{logIcons[log.type] || '▸'}</span>
                    <span>{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <div className="text-center text-zinc-700 text-[10px] uppercase tracking-widest font-bold py-8 font-display">
                  Awaiting auction feed...
                </div>
              )}
            </motion.div>
          )}

          {/* TEAMS WAR ROOM */}
          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-1.5"
            >
              {allTeamsData.map((team, idx) => {
                const TeamIcon = team.icon;
                return (
                  <div
                    key={team.name}
                    className="p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors"
                    style={{
                      background: team.isUser ? `${team.accent}08` : 'rgba(255,255,255,0.01)',
                      borderColor: team.isUser ? `${team.accent}20` : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <span className="text-[9px] font-black text-zinc-700 w-4 tabular-nums font-display">{idx + 1}</span>

                    {/* Team icon */}
                    {TeamIcon && (
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ background: `${team.accent}15` }}
                      >
                        <TeamIcon className="w-3 h-3" style={{ color: team.accent }} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-display font-black uppercase tracking-wider"
                          style={{ color: team.isUser ? team.accent : '#d4d4d8' }}
                        >
                          {team.shortName} {team.isUser && '(YOU)'}
                        </span>
                        <span className={`text-[10px] font-black tabular-nums font-display ${
                          team.purse < 15 ? 'text-rose-400' : 'text-zinc-400'
                        }`}>
                          ₹{team.purse.toFixed(1)}Cr
                        </span>
                      </div>
                      {/* Spending bar — team colored */}
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: team.accent }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, team.spent)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[7px] text-zinc-700 font-bold font-display">
                          {team.playerCount} players
                        </span>
                        <span className="text-[7px] text-zinc-700 font-bold font-display">
                          {team.overseasCount}/8 OS
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TOP BUYS */}
          {activeTab === 'top' && (
            <motion.div
              key="top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 space-y-1.5"
            >
              {topBuys.length === 0 && (
                <div className="text-center text-zinc-700 text-[10px] uppercase tracking-widest font-bold py-8 font-display">
                  No sales yet...
                </div>
              )}
              {topBuys.map((sale, idx) => {
                const buyerAccent = TEAM_DATA[sale.buyer]?.accent || '#888';
                return (
                  <div
                    key={sale.id || idx}
                    className="p-2.5 rounded-lg border flex items-center gap-2.5"
                    style={{
                      background: idx < 3 ? `${buyerAccent}06` : 'rgba(255,255,255,0.01)',
                      borderColor: idx < 3 ? `${buyerAccent}15` : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <span className={`text-sm font-black w-6 text-center font-display ${
                      idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-amber-700' : 'text-zinc-700'
                    }`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-display font-black text-white truncate">{sale.playerName}</div>
                      <div className="text-[8px] font-bold uppercase tracking-wider"
                        style={{ color: buyerAccent }}
                      >
                        {sale.buyer}
                      </div>
                    </div>
                    <span className="text-[11px] font-display font-black text-emerald-400 tabular-nums">₹{sale.price.toFixed(2)}Cr</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
