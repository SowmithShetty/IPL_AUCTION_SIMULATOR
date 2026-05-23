import { getPlayerCountryInfo } from './nationalities';

// --- STRUCTURED TIERS FOR PROCEDURAL GENERATION ---
export const RETENTION_COSTS = [16, 12, 8, 6];

export const TIERS = {
  MARQUEE: {
    BAT: ['V. Kohli', 'R. Sharma', 'S. Gill', 'T. Head', 'S. Yadav', 'S. Iyer', 'R. Gaikwad', 'Y. Jaiswal', 'R. Patidar'],
    BOWL: ['J. Bumrah', 'T. Boult', 'K. Rabada', 'P. Cummins', 'M. Starc', 'J. Archer', 'M. Shami', 'R. Khan', 'J. Hazlewood', 'M. Pathirana'],
    AR: ['H. Pandya', 'B. Stokes', 'R. Jadeja', 'G. Maxwell', 'S. Curran', 'M. Stoinis', 'A. Russell', 'C. Green', 'M. Jansen', 'W. Sundar'],
    WK: ['MS. Dhoni', 'J. Buttler', 'Q. de Kock', 'K. Rahul', 'R. Pant', 'S. Samson', 'N. Pooran', 'H. Klaasen', 'I. Kishan', 'P. Salt', 'J. Bairstow']
  },
  CAPPED: {
    BAT: ['F. du Plessis', 'D. Warner', 'S. Smith', 'K. Williamson', 'T. Varma', 'R. Singh', 'N. Rana', 'R. Tripathi', 'S. Sudharsan', 'D. Miller', 'A. Markram', 'H. Brook', 'W. Jacks', 'B. Duckett', 'T. David', 'O. Pope', 'P. Nissanka', 'C. Asalanka', 'J. Fraser-McGurk'],
    BOWL: ['A. Nortje', 'B. Kumar', 'H. Patel', 'Y. Chahal', 'K. Yadav', 'S. Narine', 'R. Ashwin', 'A. Zampa', 'M. Theekshana', 'W. Hasaranga', 'M. Siraj', 'A. Singh', 'D. Chahar', 'L. Ferguson', 'M. Wood', 'A. Joseph', 'O. McCoy', 'F. Farooqi', 'N. Ul-Haq', 'M. Sharma', 'P. Krishna', 'K. Ahmed', 'C. Sakariya', 'R. Bishnoi', 'V. Chakravarthy', 'M. Rahman', 'N. Ellis', 'S. Abbott'],
    AR: ['J. Holder', 'M. Ali', 'A. Patel', 'K. Pandya', 'S. Dube', 'V. Shankar', 'R. Tewatia', 'L. Livingstone', 'D. Mitchell', 'R. Ravindra', 'R. Shepherd', 'D. Sams', 'A. Omarzai', 'G. Naib', 'S. Raza', 'C. Woakes', 'S. Williams', 'M. Bracewell', 'K. Mayers', 'R. Cornwall', 'D. Hooda'],
    WK: ['M. Wade', 'R. Gurbaz', 'D. Conway', 'A. Carey', 'T. Banton', 'J. Inglis', 'B. McDermott', 'A. Fletcher', 'S. Hope', 'J. Cox', 'R. Rickelton', 'P. Handscomb', 'J. Clarke', 'T. Seifert', 'J. Sharma']
  },
  UNCAPPED: {
    BAT: ['A. Sharma', 'N. Wadhera', 'A. Badoni', 'S. Rizvi', 'S. Singh', 'A. Manohar', 'A. Taide', 'D. Brevis', 'T. Stubbs', 'L. Evans', 'N. Maddinson', 'M. Bryant', 'H. Cartwright', 'S. Heazlett', 'J. Weatherald', 'J. Sangha', 'A. Hose', 'S. Hain', 'M. Holden', 'C. Ingram', 'P. Stirling', 'B. King', 'R. Hendricks', 'A. Roy', 'P. Garg', 'S. Khan', 'R. Ghosh', 'Y. Dhull', 'P. Mankad', 'A. Tomar', 'R. Darji', 'M. Singh', 'A. Deshpande', 'H. Singh', 'P. Singh'],
    BOWL: ['A. Madhwal', 'Y. Dayal', 'H. Brar', 'S. Gopal', 'R. Meredith', 'C. Jordan', 'R. Gleeson', 'K. Richardson', 'J. Behrendorff', 'B. Stanlake', 'C. Tremain', 'M. Steketee', 'J. Paris', 'W. Agar', 'B. Dwarshuis', 'M. Parkinson', 'C. Parkinson', 'L. Wood', 'S. Mahmood', 'R. Rampaul', 'O. Thomas', 'S. Cottrell', 'K. Williams', 'R. Emrit', 'D. Drake', 'K. Pierre', 'M. Nabi', 'S. Lamichhane', 'A. Tye', 'J. Pattinson', 'M. Dagar', 'S. Tyagi', 'Y. Thakur', 'K. Tyagi', 'A. Vashisht', 'R. Hangargekar', 'V. Ostwal', 'S. Desai'],
    AR: ['G. Singh', 'H. Shokeen', 'M. Lomror', 'J. Overton', 'T. Curran', 'A. Hardie', 'B. Webster', 'L. Gregory', 'C. Overton', 'P. Walter', 'K. Janat', 'T. Perera', 'A. Mathews', 'D. Shanaka', 'M. Henriques', 'N. Sindhu', 'V. Arora', 'A. Tendulkar', 'P. Ray Barman', 'S. Mulani', 'A. Juyal'],
    WK: ['D. Jurel', 'P. Singh', 'K. Bharat', 'A. Porel', 'N. Jagadeesan', 'A. Rawat', 'K. Singh', 'B. Indrajith', 'S. Goswami', 'C. Jackson', 'A. Davies', 'J. Peirson', 'S. Whiteman', 'C. Bancroft', 'M. Gilkes', 'H. Nielsen', 'T. Moores', 'S. Taylor', 'R. Davies', 'G. Roelofsen', 'C. Fortuin', 'S. Erwee', 'M. Breetzke', 'P. Moor', 'C. Madande', 'B. Taylor', 'U. Bose', 'B. Kumar', 'K. Rathour', 'L. Sisodia', 'A. Tare']
  }
};

export const POOL_CATEGORIES = [
  { id: 1, name: "Set 1: Marquee 1 (M1)", desc: "Global Superstars", tier: 'MARQUEE', roles: ['BAT', 'BOWL', 'AR', 'WK'] },
  { id: 2, name: "Set 2: Marquee 2 (M2)", desc: "Elite Internationals", tier: 'MARQUEE', roles: ['BAT', 'BOWL', 'AR', 'WK'] },
  { id: 3, name: "Set 3: Capped Batsmen (BA1)", desc: "Established Top Order", tier: 'CAPPED', roles: ['BAT'] },
  { id: 4, name: "Set 4: Capped Allrounders (AL1)", desc: "Pace & Spin ARs", tier: 'CAPPED', roles: ['AR'] },
  { id: 5, name: "Set 5: Capped WKs (WK1)", desc: "Gloves & Muscle", tier: 'CAPPED', roles: ['WK'] },
  { id: 6, name: "Set 6: Capped Fast (FA1)", desc: "140kmph+ Express", tier: 'CAPPED', roles: ['BOWL'] },
  { id: 7, name: "Set 7: Capped Spin (SP1)", desc: "Mystery & Flight", tier: 'CAPPED', roles: ['BOWL'] },
  { id: 8, name: "Set 8: Uncapped Batsmen (UBA1)", desc: "Domestic Prodigies", tier: 'UNCAPPED', roles: ['BAT'] },
  { id: 9, name: "Set 9: Uncapped ARs (UAL1)", desc: "Utility Prospects", tier: 'UNCAPPED', roles: ['AR'] },
  { id: 10, name: "Set 10: Uncapped WKs (UWK1)", desc: "Agile Keepers", tier: 'UNCAPPED', roles: ['WK'] },
  { id: 11, name: "Set 11: Uncapped Fast (UFA1)", desc: "Raw Domestic Pace", tier: 'UNCAPPED', roles: ['BOWL'] },
  { id: 12, name: "Set 12: Uncapped Spin (USP1)", desc: "Local Turners", tier: 'UNCAPPED', roles: ['BOWL'] }
];

export const enrichPlayer = (player) => {
  const numHash = player.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + (player.rating || 0);
  const isIPL = numHash % 10 > 2;
  const mat = 15 + (numHash % 150);

  let style = '';
  let stats = { type: isIPL ? 'IPL' : 'T20', matches: mat };

  if (player.role === 'BAT' || player.role === 'WK') {
    style = numHash % 2 === 0 ? "Right-handed Batsman" : "Left-handed Batsman";
    if (player.role === 'WK') style = "Wicketkeeper Batsman";

    stats.runs = Math.floor(mat * (18 + ((player.rating - 70) * 0.7)));
    stats.sr = (120 + (player.rating - 70) + (numHash % 30)).toFixed(1);
    stats.avg = (22 + ((player.rating - 70) * 0.4) + (numHash % 10)).toFixed(1);
    stats.hs = 60 + (numHash % 55) + (numHash % 3 === 0 ? '*' : '');
  }
  else if (player.role === 'BOWL') {
    const bowlStyles = ["Right-arm Fast", "Left-arm Fast", "Right-arm Medium Fast", "Slow Left-arm Orthodox", "Leg-break Googly", "Right-arm Offbreak"];
    style = bowlStyles[numHash % bowlStyles.length];

    stats.wickets = Math.floor(mat * (0.8 + ((player.rating - 70) * 0.025)));
    stats.eco = (9.5 - ((player.rating - 70) * 0.08) - ((numHash % 10) / 10)).toFixed(2);
    stats.avg = (34 - ((player.rating - 70) * 0.4)).toFixed(1);
    const w = (numHash % 5) + 2;
    const r = 12 + (numHash % 30);
    stats.bbi = `${w}/${r}`;
  }
  else {
    style = numHash % 2 === 0 ? "Seam Bowling All-rounder" : "Spin Bowling All-rounder";
    stats.runs = Math.floor(mat * (12 + ((player.rating - 70) * 0.5)));
    stats.sr = (125 + (numHash % 35)).toFixed(1);
    stats.wickets = Math.floor(mat * (0.5 + ((player.rating - 70) * 0.015)));
    stats.eco = (8.8 - ((numHash % 20) / 15)).toFixed(2);
  }

  const { code, countryName, flag, isOverseas } = getPlayerCountryInfo(player.name);

  // Form indicator based on rating
  let form = 'steady';
  if (player.rating >= 92) form = 'blazing';
  else if (player.rating >= 88) form = 'hot';
  else if (player.rating >= 83) form = 'steady';
  else if (player.rating >= 78) form = 'cold';
  else form = 'unknown';

  return { ...player, style, stats, code, countryName, flag, isOverseas, form };
};

export const generateMassivePool = (existingNames) => {
  const shuffleFilter = (arr) => arr.filter(n => !existingNames.has(n)).sort(() => Math.random() - 0.5);

  const pools = {
    MARQUEE: {
      BAT: shuffleFilter([...TIERS.MARQUEE.BAT]),
      BOWL: shuffleFilter([...TIERS.MARQUEE.BOWL]),
      AR: shuffleFilter([...TIERS.MARQUEE.AR]),
      WK: shuffleFilter([...TIERS.MARQUEE.WK])
    },
    CAPPED: {
      BAT: shuffleFilter([...TIERS.CAPPED.BAT]),
      BOWL: shuffleFilter([...TIERS.CAPPED.BOWL]),
      AR: shuffleFilter([...TIERS.CAPPED.AR]),
      WK: shuffleFilter([...TIERS.CAPPED.WK])
    },
    UNCAPPED: {
      BAT: shuffleFilter([...TIERS.UNCAPPED.BAT]),
      BOWL: shuffleFilter([...TIERS.UNCAPPED.BOWL]),
      AR: shuffleFilter([...TIERS.UNCAPPED.AR]),
      WK: shuffleFilter([...TIERS.UNCAPPED.WK])
    }
  };

  const getName = (tier, role) => {
    if (pools[tier][role].length > 0) return pools[tier][role].pop();
    if (tier === 'MARQUEE' && pools['CAPPED'][role].length > 0) return pools['CAPPED'][role].pop();
    if (tier === 'CAPPED' && pools['UNCAPPED'][role].length > 0) return pools['UNCAPPED'][role].pop();
    return `Prospect ${Math.floor(Math.random() * 900) + 100}`;
  };

  let generatedPool = [];
  let idCounter = 1;

  POOL_CATEGORIES.forEach(category => {
    const playersPerSet = category.tier === 'MARQUEE' ? 10 : 12;
    for (let i = 0; i < playersPerSet; i++) {
      let rating;
      let basePrice;

      if (category.tier === 'MARQUEE') {
        rating = 90 + Math.floor(Math.random() * 8);
        basePrice = 2.0;
      } else if (category.tier === 'CAPPED') {
        rating = 82 + Math.floor(Math.random() * 8);
        const bases = [2.0, 1.5, 1.0, 0.75, 0.50];
        if (rating >= 88) basePrice = bases[Math.floor(Math.random() * 2)];
        else if (rating >= 85) basePrice = bases[Math.floor(Math.random() * 2) + 1];
        else basePrice = bases[Math.floor(Math.random() * 2) + 3];
      } else {
        rating = 74 + Math.floor(Math.random() * 8);
        const bases = [0.50, 0.40, 0.30];
        if (rating >= 79) basePrice = bases[Math.floor(Math.random() * 2)];
        else basePrice = 0.30;
      }

      const role = category.roles[Math.floor(Math.random() * category.roles.length)];
      const name = getName(category.tier, role);

      // Skip if we've run out of real names entirely
      if (name.startsWith('Prospect')) continue;

      generatedPool.push({
        id: `pool_${idCounter++}`,
        setId: category.id,
        setName: category.name,
        name: name,
        role: role,
        basePrice: basePrice,
        rating: rating,
        status: 'AVAILABLE',
        boughtBy: null,
        price: null
      });
    }
  });

  // Strict BCCI sorting logic: Set Hierarchy -> Base Price (Desc) -> Alphabetical (Asc)
  generatedPool.sort((a, b) => {
    if (a.setId !== b.setId) return a.setId - b.setId;
    if (b.basePrice !== a.basePrice) return b.basePrice - a.basePrice;
    return a.name.localeCompare(b.name);
  });

  return generatedPool;
};
