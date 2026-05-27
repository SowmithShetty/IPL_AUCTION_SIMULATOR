import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TEAM_DATA } from '../data/teams';

/**
 * LiveTicker — ESPN-style broadcast bar at bottom of screen.
 * LIVE badge, team-colored names, vertical separators, BREAKING for big sales.
 */
export default function LiveTicker({ salesLog, aiTeams, userFranchise, userPurse }) {
  const [tickerItems, setTickerItems] = useState([]);

  useEffect(() => {
    const items = [];

    // Recent sales (last 8)
    salesLog.slice(0, 8).forEach((sale, i) => {
      if (sale.type === 'sold') {
        const isBreaking = sale.price >= 15;
        items.push({
          id: `sale-${i}`,
          text: `${sale.playerName} → ${sale.buyer} ₹${sale.price.toFixed(2)}Cr`,
          type: isBreaking ? 'breaking' : 'sale',
          teamAccent: TEAM_DATA[sale.buyer]?.accent || '#10b981',
        });
      } else if (sale.type === 'unsold') {
        items.push({
          id: `unsold-${i}`,
          text: `${sale.playerName} — UNSOLD`,
          type: 'unsold',
        });
      }
    });

    // Top 3 biggest buys
    const bigBuys = [...salesLog]
      .filter(s => s.type === 'sold')
      .sort((a, b) => b.price - a.price)
      .slice(0, 3);

    if (bigBuys.length > 0) {
      items.push({
        id: 'top-buy-header',
        text: '🏆 TOP BUYS:',
        type: 'header',
      });
      bigBuys.forEach((buy, i) => {
        items.push({
          id: `top-${i}`,
          text: `${buy.playerName} ₹${buy.price.toFixed(2)}Cr (${buy.buyer})`,
          type: 'highlight',
          teamAccent: TEAM_DATA[buy.buyer]?.accent || '#f59e0b',
        });
      });
    }

    // Low purse warnings
    const lowPurseTeams = aiTeams.filter(t => t.purse < 20).sort((a, b) => a.purse - b.purse);
    if (lowPurseTeams.length > 0) {
      items.push({
        id: 'purse-alert',
        text: `⚠️ LOW PURSE: ${lowPurseTeams.map(t => `${t.name} ₹${t.purse.toFixed(1)}Cr`).join(' | ')}`,
        type: 'warning',
      });
    }

    setTickerItems(items);
  }, [salesLog, aiTeams]);

  if (tickerItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden h-8 flex items-center">
      {/* LIVE Badge */}
      <div className="shrink-0 flex items-center gap-1.5 px-4 border-r border-white/10 h-full bg-rose-500/8">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 live-pulse" />
        <span className="text-[9px] font-display font-black uppercase tracking-widest text-rose-400">Live</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          className="flex items-center gap-0 h-full whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: Math.max(30, tickerItems.length * 4),
              ease: 'linear',
            },
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={`${item.id}-${i}`}
              className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 font-display ${
                item.type === 'breaking' ? 'font-black' :
                item.type === 'sale' ? '' :
                item.type === 'unsold' ? 'text-rose-400/50' :
                item.type === 'header' ? 'font-black' :
                item.type === 'highlight' ? '' :
                item.type === 'warning' ? 'text-rose-400' :
                'text-zinc-400'
              }`}
              style={{
                color: item.type === 'breaking'
                  ? '#ef4444'
                  : item.type === 'sale'
                  ? item.teamAccent || '#10b981'
                  : item.type === 'highlight'
                  ? item.teamAccent || '#f59e0b'
                  : item.type === 'header'
                  ? '#f59e0b'
                  : undefined,
              }}
            >
              {item.type === 'breaking' && (
                <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded mr-1.5 tracking-widest">
                  BREAKING
                </span>
              )}
              {item.text}
              {/* Vertical separator */}
              <span className="inline-block w-px h-3 bg-white/10 mx-4 align-middle" />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
