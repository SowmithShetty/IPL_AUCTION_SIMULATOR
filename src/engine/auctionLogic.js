// --- AUCTION LOGIC ENGINE ---

export const getNextBid = (current) => {
  if (current < 1.0) return +(current + 0.05).toFixed(2);
  if (current < 2.0) return +(current + 0.10).toFixed(2);
  if (current < 3.0) return +(current + 0.20).toFixed(2);
  if (current < 10.0) return +(current + 0.25).toFixed(2);
  return +(current + 0.50).toFixed(2);
};

export const getDealEvaluation = (price, rating, basePrice) => {
  const ratingFactor = Math.pow(Math.max(0, rating - 75) / 25, 2);
  const fairValue = (ratingFactor * 28) + basePrice;
  if (price <= fairValue * 0.75) return { text: "STEAL DEAL", color: "text-emerald-400 border-emerald-500 bg-emerald-950/40", emoji: "🔥" };
  if (price >= fairValue * 1.25) return { text: "OVERPRICED", color: "text-rose-400 border-rose-500 bg-rose-950/40", emoji: "📉" };
  return { text: "PAR VALUE", color: "text-amber-400 border-amber-500 bg-amber-950/40", emoji: "⚖️" };
};

// How many teams are likely interested in this player
export const getDemandLevel = (player, aiTeams) => {
  let interested = 0;
  aiTeams.forEach(t => {
    if (player.isOverseas && t.roster.filter(p => p.isOverseas).length >= 8) return;
    if (t.purse < player.basePrice) return;
    // Higher-rated players attract more interest
    if (player.rating >= 90) interested++;
    else if (player.rating >= 85 && Math.random() > 0.3) interested++;
    else if (Math.random() > 0.6) interested++;
  });
  if (interested >= 6) return { level: 'extreme', label: 'EXTREME DEMAND', color: 'text-rose-400' };
  if (interested >= 4) return { level: 'high', label: 'HIGH DEMAND', color: 'text-amber-400' };
  if (interested >= 2) return { level: 'moderate', label: 'MODERATE', color: 'text-emerald-400' };
  return { level: 'low', label: 'LIMITED INTEREST', color: 'text-zinc-500' };
};
