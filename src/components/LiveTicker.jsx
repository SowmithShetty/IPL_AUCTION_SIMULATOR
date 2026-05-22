import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

/**
 * LiveTicker — ESPN-style scrolling ticker at the bottom of the screen.
 * Shows recent sales, biggest buys, and purse updates.
 */
export default function LiveTicker({ salesLog, aiTeams, userFranchise, userPurse }) {
  const [tickerItems, setTickerItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const items = [];

    // Recent sales (last 8)
    salesLog.slice(0, 8).forEach((sale, i) => {
      if (sale.type === 'sold') {
        items.push({
          id: `sale-${i}`,
          text: `${sale.playerName} → ${sale.buyer} ₹${sale.price.toFixed(2)}Cr`,
          type: 'sale',
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
        });
      });
    }

    // Purse updates
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-t border-white/10 overflow-hidden h-8">
      <motion.div
        ref={scrollRef}
        className="flex items-center gap-6 h-full whitespace-nowrap"
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
            className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
              item.type === 'sale' ? 'text-emerald-400' :
              item.type === 'unsold' ? 'text-rose-400/60' :
              item.type === 'header' ? 'text-amber-400 font-black' :
              item.type === 'highlight' ? 'text-amber-300' :
              item.type === 'warning' ? 'text-rose-400' :
              'text-zinc-400'
            }`}
          >
            {item.text}
            <span className="text-zinc-700 mx-3">●</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
