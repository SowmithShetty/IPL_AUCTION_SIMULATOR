// --- AI STRATEGY ENGINE WITH TEAM PERSONALITIES ---

// Each team has a distinct bidding personality that mirrors their real IPL strategy
const TEAM_PERSONALITIES = {
  "Chennai": {
    tag: "The Strategist",
    desc: "Conservative, experience-loving. Rarely overpays. Targets proven match-winners.",
    marqueeMultiplier: 0.9,
    cappedMultiplier: 1.1,
    uncappedMultiplier: 0.7,
    rolePrefs: { BAT: 1.0, BOWL: 1.0, AR: 1.2, WK: 0.9 },
    aggressiveness: 0.7,    // 0-1, how likely to push beyond fair value
    earlySpender: false,     // does the team blow budget early?
    ratingThreshold: 84,     // minimum rating they'll aggressively chase
  },
  "Mumbai": {
    tag: "The Alpha Predator",
    desc: "Aggressive on marquee talent. Will overpay 20% for 90+ rated stars.",
    marqueeMultiplier: 1.3,
    cappedMultiplier: 1.0,
    uncappedMultiplier: 0.8,
    rolePrefs: { BAT: 1.1, BOWL: 1.3, AR: 1.2, WK: 0.9 },
    aggressiveness: 0.9,
    earlySpender: true,
    ratingThreshold: 88,
  },
  "Bengaluru": {
    tag: "The Wildcard",
    desc: "Unpredictable, star-chaser. Random surges on big names.",
    marqueeMultiplier: 1.2,
    cappedMultiplier: 0.9,
    uncappedMultiplier: 0.8,
    rolePrefs: { BAT: 1.3, BOWL: 1.0, AR: 1.1, WK: 0.8 },
    aggressiveness: 0.85,
    earlySpender: true,
    ratingThreshold: 86,
  },
  "Kolkata": {
    tag: "The Tactician",
    desc: "Balanced, mystery spin lovers. Extra budget for spinners.",
    marqueeMultiplier: 1.0,
    cappedMultiplier: 1.1,
    uncappedMultiplier: 1.0,
    rolePrefs: { BAT: 1.0, BOWL: 1.3, AR: 1.1, WK: 0.9 },
    aggressiveness: 0.75,
    earlySpender: false,
    ratingThreshold: 83,
  },
  "Hyderabad": {
    tag: "The Pace Hunter",
    desc: "Pace obsessed. 30% extra willingness on fast bowlers.",
    marqueeMultiplier: 1.1,
    cappedMultiplier: 1.1,
    uncappedMultiplier: 0.9,
    rolePrefs: { BAT: 0.9, BOWL: 1.4, AR: 1.0, WK: 0.8 },
    aggressiveness: 0.8,
    earlySpender: false,
    ratingThreshold: 85,
  },
  "Delhi": {
    tag: "The Youth Scout",
    desc: "Youth-focused. Overpays for uncapped talent.",
    marqueeMultiplier: 0.9,
    cappedMultiplier: 1.0,
    uncappedMultiplier: 1.4,
    rolePrefs: { BAT: 1.1, BOWL: 1.0, AR: 1.2, WK: 1.0 },
    aggressiveness: 0.8,
    earlySpender: false,
    ratingThreshold: 80,
  },
  "Rajasthan": {
    tag: "The Analyst",
    desc: "Strategic, wicketkeeper-bat heavy. Data-driven picks.",
    marqueeMultiplier: 1.0,
    cappedMultiplier: 1.0,
    uncappedMultiplier: 0.9,
    rolePrefs: { BAT: 1.0, BOWL: 1.0, AR: 1.0, WK: 1.4 },
    aggressiveness: 0.7,
    earlySpender: false,
    ratingThreshold: 84,
  },
  "Punjab": {
    tag: "The Budget Blaster",
    desc: "Goes big early, runs out late. Explosive opener.",
    marqueeMultiplier: 1.3,
    cappedMultiplier: 1.2,
    uncappedMultiplier: 0.6,
    rolePrefs: { BAT: 1.1, BOWL: 1.1, AR: 1.1, WK: 0.9 },
    aggressiveness: 0.95,
    earlySpender: true,
    ratingThreshold: 82,
  },
  "Lucknow": {
    tag: "The Calculator",
    desc: "Calculated. Strictly follows fair value. Never overpays.",
    marqueeMultiplier: 1.0,
    cappedMultiplier: 1.0,
    uncappedMultiplier: 1.0,
    rolePrefs: { BAT: 1.0, BOWL: 1.0, AR: 1.1, WK: 1.0 },
    aggressiveness: 0.6,
    earlySpender: false,
    ratingThreshold: 85,
  },
  "Gujarat": {
    tag: "The Death Specialist",
    desc: "Death-over specialists. Premium on pace + all-rounders.",
    marqueeMultiplier: 1.0,
    cappedMultiplier: 1.1,
    uncappedMultiplier: 1.0,
    rolePrefs: { BAT: 0.9, BOWL: 1.2, AR: 1.3, WK: 0.8 },
    aggressiveness: 0.75,
    earlySpender: false,
    ratingThreshold: 83,
  }
};

export const getTeamPersonality = (teamName) => {
  return TEAM_PERSONALITIES[teamName] || TEAM_PERSONALITIES["Lucknow"]; // default to balanced
};

/**
 * Evaluate if an AI team should bid on the current player
 * Returns: { shouldBid: boolean, maxCap: number }
 */
export const evaluateAIBid = (teamName, currentPlayer, currentBid, highestBidder, aiTeams, getNextBidFn) => {
  const nextBid = getNextBidFn(currentBid);
  const team = aiTeams.find(t => t.name === teamName);
  if (!team) return { shouldBid: false };

  // Can't bid if already leading
  if (teamName === highestBidder) return { shouldBid: false };

  // Overseas limit check
  if (currentPlayer.isOverseas && team.roster.filter(p => p.isOverseas).length >= 8) {
    return { shouldBid: false };
  }

  // Purse check
  if (team.purse < nextBid) return { shouldBid: false };

  const personality = getTeamPersonality(teamName);

  // Calculate personalized max value
  const ratingFactor = Math.pow(Math.max(0, currentPlayer.rating - 75) / 25, 2);
  let baseMaxValue = (ratingFactor * 28) + currentPlayer.basePrice;

  // Apply tier multiplier
  if (currentPlayer.setId <= 2) baseMaxValue *= personality.marqueeMultiplier;
  else if (currentPlayer.setId <= 7) baseMaxValue *= personality.cappedMultiplier;
  else baseMaxValue *= personality.uncappedMultiplier;

  // Apply role preference
  const rolePref = personality.rolePrefs[currentPlayer.role] || 1.0;
  baseMaxValue *= rolePref;

  // Apply aggressiveness as random variation
  const aggVariation = 0.7 + (Math.random() * personality.aggressiveness * 0.6);
  const finalMaxCap = baseMaxValue * aggVariation;

  // Rating threshold — less interest in below-threshold players
  if (currentPlayer.rating < personality.ratingThreshold) {
    if (Math.random() > 0.4) return { shouldBid: false };
  }

  // Early spenders are more willing to overpay in early sets
  if (personality.earlySpender && currentPlayer.setId <= 2) {
    const boostChance = 0.3;
    if (Math.random() < boostChance) {
      return { shouldBid: nextBid <= finalMaxCap * 1.15, maxCap: finalMaxCap * 1.15 };
    }
  }

  // Willingness decreases as bid approaches max cap
  const willingness = Math.max(0.05, 1 - (nextBid / finalMaxCap));

  if (Math.random() < willingness && nextBid <= finalMaxCap) {
    return { shouldBid: true, maxCap: finalMaxCap };
  }

  return { shouldBid: false };
};

/**
 * Select which AI team (if any) should bid next
 */
export const getNextAIBidder = (currentPlayer, currentBid, highestBidder, aiTeams, getNextBidFn) => {
  const nextBid = getNextBidFn(currentBid);

  // Filter eligible teams
  let candidates = [];
  aiTeams.forEach(team => {
    if (team.name === highestBidder) return;
    if (team.purse < nextBid) return;
    if (currentPlayer.isOverseas && team.roster.filter(p => p.isOverseas).length >= 8) return;

    const eval_ = evaluateAIBid(team.name, currentPlayer, currentBid, highestBidder, aiTeams, getNextBidFn);
    if (eval_.shouldBid) {
      candidates.push({ name: team.name, maxCap: eval_.maxCap || 0 });
    }
  });

  if (candidates.length === 0) return null;

  // Weighted random selection — teams with higher maxCap are more likely to bid
  const totalWeight = candidates.reduce((sum, c) => sum + (c.maxCap || 1), 0);
  let rand = Math.random() * totalWeight;
  for (const c of candidates) {
    rand -= (c.maxCap || 1);
    if (rand <= 0) return c.name;
  }

  return candidates[0].name;
};

export { TEAM_PERSONALITIES };
