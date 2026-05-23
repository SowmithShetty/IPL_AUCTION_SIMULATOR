import { getPlayerCountryInfo } from './nationalities';

// --- BASE FRANCHISE COSTS ---
export const RETENTION_COSTS = [16, 12, 8, 6];

// --- PLAYER INITIALS TO BEAUTIFUL FULL NAME DICTIONARY ---
export const PLAYER_FULL_NAMES = {
  // MARQUEE BAT
  'V. Kohli': 'Virat Kohli',
  'R. Sharma': 'Rohit Sharma',
  'S. Gill': 'Shubman Gill',
  'T. Head': 'Travis Head',
  'S. Yadav': 'Suryakumar Yadav',
  'S. Iyer': 'Shreyas Iyer',
  'R. Gaikwad': 'Ruturaj Gaikwad',
  'Y. Jaiswal': 'Yashasvi Jaiswal',
  'R. Patidar': 'Rajat Patidar',
  // MARQUEE BOWL
  'J. Bumrah': 'Jasprit Bumrah',
  'T. Boult': 'Trent Boult',
  'K. Rabada': 'Kagiso Rabada',
  'P. Cummins': 'Pat Cummins',
  'M. Starc': 'Mitchell Starc',
  'J. Archer': 'Jofra Archer',
  'M. Shami': 'Mohammed Shami',
  'R. Khan': 'Rashid Khan',
  'J. Hazlewood': 'Josh Hazlewood',
  'M. Pathirana': 'Matheesha Pathirana',
  // MARQUEE AR
  'H. Pandya': 'Hardik Pandya',
  'B. Stokes': 'Ben Stokes',
  'R. Jadeja': 'Ravindra Jadeja',
  'G. Maxwell': 'Glenn Maxwell',
  'S. Curran': 'Sam Curran',
  'M. Stoinis': 'Marcus Stoinis',
  'A. Russell': 'Andre Russell',
  'C. Green': 'Cameron Green',
  'M. Jansen': 'Marco Jansen',
  'W. Sundar': 'Washington Sundar',
  // MARQUEE WK
  'MS. Dhoni': 'Mahendra Singh Dhoni',
  'J. Buttler': 'Jos Buttler',
  'Q. de Kock': 'Quinton de Kock',
  'K. Rahul': 'K. L. Rahul',
  'R. Pant': 'Rishabh Pant',
  'S. Samson': 'Sanju Samson',
  'N. Pooran': 'Nicholas Pooran',
  'H. Klaasen': 'Heinrich Klaasen',
  'I. Kishan': 'Ishan Kishan',
  'P. Salt': 'Phil Salt',
  'J. Bairstow': 'Jonny Bairstow',

  // CAPPED BAT
  'F. du Plessis': 'Faf du Plessis',
  'D. Warner': 'David Warner',
  'S. Smith': 'Steve Smith',
  'K. Williamson': 'Kane Williamson',
  'T. Varma': 'Tilak Varma',
  'R. Singh': 'Rinku Singh',
  'N. Rana': 'Nitish Rana',
  'R. Tripathi': 'Rahul Tripathi',
  'S. Sudharsan': 'Sai Sudharsan',
  'D. Miller': 'David Miller',
  'A. Markram': 'Aiden Markram',
  'H. Brook': 'Harry Brook',
  'W. Jacks': 'Will Jacks',
  'B. Duckett': 'Ben Duckett',
  'T. David': 'Tim David',
  'O. Pope': 'Ollie Pope',
  'P. Nissanka': 'Pathum Nissanka',
  'C. Asalanka': 'Charith Asalanka',
  'J. Fraser-McGurk': 'Jake Fraser-McGurk',
  'D. Padikkal': 'Devdutt Padikkal',
  'P. Shaw': 'Prithvi Shaw',
  'M. Agarwal': 'Mayank Agarwal',
  'S. Dhawan': 'Shikhar Dhawan',
  'V. Iyer': 'Venkatesh Iyer',
  'A. Rayudu': 'Ambati Rayudu',
  'M. Pandey': 'Manish Pandey',
  'K. Nair': 'Karun Nair',
  'R. Powell': 'Rovman Powell',
  'S. Hetmyer': 'Shimron Hetmyer',
  'E. Lewis': 'Evin Lewis',
  'J. Roy': 'Jason Roy',
  'A. Hales': 'Alex Hales',
  'D. Malan': 'Dawid Malan',
  'J. Vince': 'James Vince',
  'J. Root': 'Joe Root',
  'M. Guptill': 'Martin Guptill',
  'C. Munro': 'Colin Munro',
  'G. Phillips': 'Glenn Phillips',
  'M. Marsh': 'Mitchell Marsh',
  'A. Turner': 'Ashton Turner',
  'M. Short': 'Matthew Short',

  // CAPPED BOWL
  'A. Nortje': 'Anrich Nortje',
  'B. Kumar': 'Bhuvneshwar Kumar',
  'H. Patel': 'Harshal Patel',
  'Y. Chahal': 'Yuzvendra Chahal',
  'K. Yadav': 'Kuldeep Yadav',
  'S. Narine': 'Sunil Narine',
  'R. Ashwin': 'Ravichandran Ashwin',
  'A. Zampa': 'Adam Zampa',
  'M. Theekshana': 'Maheesh Theekshana',
  'W. Hasaranga': 'Wanindu Hasaranga',
  'M. Siraj': 'Mohammed Siraj',
  'A. Singh': 'Arshdeep Singh',
  'D. Chahar': 'Deepak Chahar',
  'L. Ferguson': 'Lockie Ferguson',
  'M. Wood': 'Mark Wood',
  'A. Joseph': 'Alzarri Joseph',
  'O. McCoy': 'Obed McCoy',
  'F. Farooqi': 'Fazalhaq Farooqi',
  'N. Ul-Haq': 'Naveen-ul-Haq',
  'M. Sharma': 'Mohit Sharma',
  'P. Krishna': 'Prasidh Krishna',
  'K. Ahmed': 'Khaleel Ahmed',
  'C. Sakariya': 'Chetan Sakariya',
  'R. Bishnoi': 'Ravi Bishnoi',
  'V. Chakravarthy': 'Varun Chakravarthy',
  'M. Rahman': 'Mustafizur Rahman',
  'N. Ellis': 'Nathan Ellis',
  'S. Abbott': 'Sean Abbott',
  'U. Yadav': 'Umesh Yadav',
  'T. Natarajan': 'T. Natarajan',
  'J. Unadkat': 'Jaydev Unadkat',
  'P. Chawla': 'Piyush Chawla',
  'A. Mishra': 'Amit Mishra',
  'S. Kaul': 'Siddharth Kaul',
  'D. Kulkarni': 'Dhawal Kulkarni',
  'I. Tahir': 'Imran Tahir',
  'L. Ngidi': 'Lungi Ngidi',
  'G. Coetzee': 'Gerald Coetzee',
  'N. Burger': 'Nandre Burger',
  'T. Southee': 'Tim Southee',
  'M. Henry': 'Matt Henry',
  'K. Jamieson': 'Kyle Jamieson',
  'A. Milne': 'Adam Milne',
  'I. Sodhi': 'Ish Sodhi',
  'R. Topley': 'Reece Topley',
  'A. Rashid': 'Adil Rashid',
  'J. Little': 'Josh Little',
  'D. Chameera': 'Dushmantha Chameera',
  'T. Ahmed': 'Taskin Ahmed',
  'J. Behrendorff': 'Jason Behrendorff',
  'R. Meredith': 'Riley Meredith',
  'A. Tye': 'Andrew Tye',

  // CAPPED AR
  'J. Holder': 'Jason Holder',
  'M. Ali': 'Moeen Ali',
  'A. Patel': 'Axar Patel',
  'K. Pandya': 'Krunal Pandya',
  'S. Dube': 'Shivam Dube',
  'V. Shankar': 'Vijay Shankar',
  'R. Tewatia': 'Rahul Tewatia',
  'L. Livingstone': 'Liam Livingstone',
  'D. Mitchell': 'Daryl Mitchell',
  'R. Ravindra': 'Rachin Ravindra',
  'R. Shepherd': 'Romario Shepherd',
  'D. Sams': 'Daniel Sams',
  'A. Omarzai': 'Azmatullah Omarzai',
  'G. Naib': 'Gulbadin Naib',
  'S. Raza': 'Sikandar Raza',
  'C. Woakes': 'Chris Woakes',
  'S. Williams': 'Sean Williams',
  'M. Bracewell': 'Michael Bracewell',
  'K. Mayers': 'Kyle Mayers',
  'R. Cornwall': 'Rahkeem Cornwall',
  'D. Hooda': 'Deepak Hooda',
  'S. Thakur': 'Shardul Thakur',
  'Y. Pathan': 'Yusuf Pathan',
  'K. Gowtham': 'Krishnappa Gowtham',
  'R. Parag': 'Riyan Parag',
  'K. Pollard': 'Kieron Pollard',
  'J. Neesham': 'Jimmy Neesham',
  'S. Al Hasan': 'Shakib Al Hasan',
  'C. de Leede': 'Bas de Leede',
  'D. Willey': 'David Willey',
  'R. Bopara': 'Ravi Bopara',
  'A. Agar': 'Ashton Agar',
  'M. Neser': 'Michael Neser',
  'F. Allen': 'Finn Allen',
  'K. Paul': 'Keemo Paul',
  'D. Wiese': 'David Wiese',

  // CAPPED WK
  'M. Wade': 'Matthew Wade',
  'R. Gurbaz': 'Rahmanullah Gurbaz',
  'D. Conway': 'Devon Conway',
  'A. Carey': 'Alex Carey',
  'T. Banton': 'Tom Banton',
  'J. Inglis': 'Josh Inglis',
  'B. McDermott': 'Ben McDermott',
  'A. Fletcher': 'Andre Fletcher',
  'S. Hope': 'Shai Hope',
  'J. Cox': 'Jordan Cox',
  'R. Rickelton': 'Ryan Rickelton',
  'P. Handscomb': 'Peter Handscomb',
  'J. Clarke': 'Joe Clarke',
  'T. Seifert': 'Tim Seifert',
  'J. Sharma': 'Jitesh Sharma',
  'W. Saha': 'Wriddhiman Saha',
  'D. Karthik': 'Dinesh Karthik',
  'P. Patel': 'Parthiv Patel',
  'L. Ronchi': 'Luke Ronchi',
  'K. Perera': 'Kusal Perera',
  'S. Billings': 'Sam Billings',
  'L. Das': 'Litton Das',
  'M. Cross': 'Matthew Cross',
  'L. Tucker': 'Lorcan Tucker',
  'T. Blundell': 'Tom Blundell',
  'D. Cleaver': 'Dane Cleaver',
  'S. Harper': 'Sam Harper',

  // UNCAPPED BAT
  'A. Sharma': 'Abhishek Sharma',
  'N. Wadhera': 'Nehal Wadhera',
  'A. Badoni': 'Ayush Badoni',
  'S. Rizvi': 'Sameer Rizvi',
  'S. Singh': 'Shashank Singh',
  'A. Manohar': 'Abhinav Manohar',
  'A. Taide': 'Atharva Taide',
  'D. Brevis': 'Dewald Brevis',
  'T. Stubbs': 'Tristan Stubbs',
  'A. Madhwal': 'Akash Madhwal',
  'Y. Dayal': 'Yash Dayal',
  'H. Brar': 'Harpreet Brar',
  'S. Gopal': 'Shreyas Gopal',
  'M. Lomror': 'Mahipal Lomror',
  'A. Tendulkar': 'Arjun Tendulkar',
  'D. Jurel': 'Dhruv Jurel',
  'P. Singh': 'Prabhsimran Singh',
  'K. Bharat': 'K. S. Bharat',
  'A. Porel': 'Abishek Porel',
  'N. Jagadeesan': 'N. Jagadeesan',
  'A. Rawat': 'Anuj Rawat',
};

// --- STRUCTURED TIERS FOR PROCEDURAL GENERATION ---
export const TIERS = {
  MARQUEE: {
    BAT: ['V. Kohli', 'R. Sharma', 'S. Gill', 'T. Head', 'S. Yadav', 'S. Iyer', 'R. Gaikwad', 'Y. Jaiswal', 'R. Patidar', 'F. du Plessis', 'D. Warner', 'KL. Rahul'],
    BOWL: ['J. Bumrah', 'T. Boult', 'K. Rabada', 'P. Cummins', 'M. Starc', 'J. Archer', 'M. Shami', 'R. Khan', 'J. Hazlewood', 'M. Pathirana', 'M. Siraj', 'A. Singh', 'Y. Chahal', 'K. Yadav'],
    AR: ['H. Pandya', 'B. Stokes', 'R. Jadeja', 'G. Maxwell', 'S. Curran', 'M. Stoinis', 'A. Russell', 'C. Green', 'M. Jansen', 'W. Sundar', 'A. Patel', 'K. Pandya', 'S. Dube', 'L. Livingstone'],
    WK: ['MS. Dhoni', 'J. Buttler', 'Q. de Kock', 'K. Rahul', 'R. Pant', 'S. Samson', 'N. Pooran', 'H. Klaasen', 'I. Kishan', 'P. Salt', 'J. Bairstow']
  },
  CAPPED: {
    BAT: ['F. du Plessis', 'D. Warner', 'S. Smith', 'K. Williamson', 'T. Varma', 'R. Singh', 'N. Rana', 'R. Tripathi', 'S. Sudharsan', 'D. Miller', 'A. Markram', 'H. Brook', 'W. Jacks', 'B. Duckett', 'T. David', 'O. Pope', 'P. Nissanka', 'C. Asalanka', 'J. Fraser-McGurk', 'D. Padikkal', 'P. Shaw', 'M. Agarwal', 'S. Dhawan', 'V. Iyer', 'A. Rayudu', 'M. Pandey', 'K. Nair', 'R. Powell', 'S. Hetmyer', 'E. Lewis', 'J. Roy', 'A. Hales', 'D. Malan', 'J. Vince', 'J. Root', 'M. Guptill', 'C. Munro', 'G. Phillips', 'M. Marsh', 'A. Turner', 'M. Short'],
    BOWL: ['A. Nortje', 'B. Kumar', 'H. Patel', 'Y. Chahal', 'K. Yadav', 'S. Narine', 'R. Ashwin', 'A. Zampa', 'M. Theekshana', 'W. Hasaranga', 'M. Siraj', 'A. Singh', 'D. Chahar', 'L. Ferguson', 'M. Wood', 'A. Joseph', 'O. McCoy', 'F. Farooqi', 'N. Ul-Haq', 'M. Sharma', 'P. Krishna', 'K. Ahmed', 'C. Sakariya', 'R. Bishnoi', 'V. Chakravarthy', 'M. Rahman', 'N. Ellis', 'S. Abbott', 'U. Yadav', 'T. Natarajan', 'J. Unadkat', 'P. Chawla', 'A. Mishra', 'S. Kaul', 'D. Kulkarni', 'I. Tahir', 'L. Ngidi', 'G. Coetzee', 'N. Burger', 'T. Southee', 'M. Henry', 'K. Jamieson', 'A. Milne', 'I. Sodhi', 'R. Topley', 'A. Rashid', 'J. Little', 'D. Chameera', 'T. Ahmed', 'J. Behrendorff', 'R. Meredith', 'A. Tye'],
    AR: ['J. Holder', 'M. Ali', 'A. Patel', 'K. Pandya', 'S. Dube', 'V. Shankar', 'R. Tewatia', 'L. Livingstone', 'D. Mitchell', 'R. Ravindra', 'R. Shepherd', 'D. Sams', 'A. Omarzai', 'G. Naib', 'S. Raza', 'C. Woakes', 'S. Williams', 'M. Bracewell', 'K. Mayers', 'R. Cornwall', 'D. Hooda', 'S. Thakur', 'Y. Pathan', 'K. Gowtham', 'R. Parag', 'K. Pollard', 'J. Neesham', 'S. Al Hasan', 'C. de Leede', 'D. Willey', 'R. Bopara', 'A. Agar', 'M. Neser', 'F. Allen', 'K. Paul', 'D. Wiese'],
    WK: ['M. Wade', 'R. Gurbaz', 'D. Conway', 'A. Carey', 'T. Banton', 'J. Inglis', 'B. McDermott', 'A. Fletcher', 'S. Hope', 'J. Cox', 'R. Rickelton', 'P. Handscomb', 'J. Clarke', 'T. Seifert', 'J. Sharma', 'W. Saha', 'D. Karthik', 'P. Patel', 'L. Ronchi', 'K. Perera', 'S. Billings', 'L. Das', 'M. Cross', 'L. Tucker', 'T. Blundell', 'D. Cleaver', 'S. Harper']
  },
  UNCAPPED: {
    BAT: ['A. Sharma', 'N. Wadhera', 'A. Badoni', 'S. Rizvi', 'S. Singh', 'A. Manohar', 'A. Taide', 'D. Brevis', 'T. Stubbs', 'L. Evans', 'N. Maddinson', 'M. Bryant', 'H. Cartwright', 'S. Heazlett', 'J. Weatherald', 'J. Sangha', 'A. Hose', 'S. Hain', 'M. Holden', 'C. Ingram', 'P. Stirling', 'B. King', 'R. Hendricks', 'A. Roy', 'P. Garg', 'S. Khan', 'R. Ghosh', 'Y. Dhull', 'P. Mankad', 'A. Tomar', 'R. Darji', 'M. Singh', 'A. Deshpande', 'H. Singh', 'P. Singh', 'S. Tiwary', 'K. Jadhav', 'U. Chand', 'P. Chand', 'V. Kutty', 'A. Raghuvanshi', 'M. Siddharth', 'S. Rasheed', 'A. Hebbar', 'U. Kaul', 'H. Nishad'],
    BOWL: ['A. Madhwal', 'Y. Dayal', 'H. Brar', 'S. Gopal', 'R. Meredith', 'C. Jordan', 'R. Gleeson', 'K. Richardson', 'J. Behrendorff', 'B. Stanlake', 'C. Tremain', 'M. Steketee', 'J. Paris', 'W. Agar', 'B. Dwarshuis', 'M. Parkinson', 'C. Parkinson', 'L. Wood', 'S. Mahmood', 'R. Rampaul', 'O. Thomas', 'S. Cottrell', 'K. Williams', 'R. Emrit', 'D. Drake', 'K. Pierre', 'M. Nabi', 'S. Lamichhane', 'A. Tye', 'J. Pattinson', 'M. Dagar', 'S. Tyagi', 'Y. Thakur', 'K. Tyagi', 'A. Vashisht', 'R. Hangargekar', 'V. Ostwal', 'S. Desai', 'M. Markande', 'S. Sharma', 'K. Khejroliya', 'A. Rajpoot', 'S. Ravi', 'R. Sai Kishore', 'M. Siddharth', 'M. Choudhary', 'V. Vyshak', 'R. Salam', 'H. Shokeen', 'R. Dar', 'S. Sandeep'],
    AR: ['G. Singh', 'H. Shokeen', 'M. Lomror', 'J. Overton', 'T. Curran', 'A. Hardie', 'B. Webster', 'L. Gregory', 'C. Overton', 'P. Walter', 'K. Janat', 'T. Perera', 'A. Mathews', 'D. Shanaka', 'M. Henriques', 'N. Sindhu', 'V. Arora', 'A. Tendulkar', 'P. Ray Barman', 'S. Mulani', 'A. Juyal', 'V. Singh', 'D. Nalkande', 'A. Sarkar', 'S. Rana', 'P. Choudhary', 'N. Wadhera', 'S. Rizvi', 'R. Hangargekar', 'P. Mankad', 'A. Kulkarni', 'S. Ram', 'M. Kumar'],
    WK: ['D. Jurel', 'P. Singh', 'K. Bharat', 'A. Porel', 'N. Jagadeesan', 'A. Rawat', 'K. Singh', 'B. Indrajith', 'S. Goswami', 'C. Jackson', 'A. Davies', 'J. Peirson', 'S. Whiteman', 'C. Bancroft', 'M. Gilkes', 'H. Nielsen', 'T. Moores', 'S. Taylor', 'R. Davies', 'G. Roelofsen', 'C. Fortuin', 'S. Erwee', 'M. Breetzke', 'P. Moor', 'C. Madande', 'B. Taylor', 'U. Bose', 'B. Kumar', 'K. Rathour', 'L. Sisodia', 'A. Tare', 'S. Bharat', 'R. Smarsh', 'A. Kazi', 'K. Shinde', 'E. Srinivasan', 'S. Prasad', 'V. Vinod', 'K. Wickham', 'J. Liyanage']
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

  // Determine nationality (check if explicitly generated or lookup in nationalities table)
  let code = 'IND', countryName = 'India', flag = '🇮🇳', isOverseas = false;
  if (player.isOverseas !== undefined) {
    code = player.code;
    countryName = player.countryName;
    flag = player.flag;
    isOverseas = player.isOverseas;
  } else {
    const countryInfo = getPlayerCountryInfo(player.name);
    code = countryInfo.code;
    countryName = countryInfo.countryName;
    flag = countryInfo.flag;
    isOverseas = countryInfo.isOverseas;
  }

  // Form indicator based on rating
  let form = 'steady';
  if (player.rating >= 92) form = 'blazing';
  else if (player.rating >= 88) form = 'hot';
  else if (player.rating >= 83) form = 'steady';
  else if (player.rating >= 78) form = 'cold';
  else form = 'unknown';

  const originalName = player.name;
  const fullName = PLAYER_FULL_NAMES[originalName] || originalName;

  return { ...player, name: fullName, originalName, style, stats, code, countryName, flag, isOverseas, form };
};

// --- AUTHENTIC PROCEDURAL CRICKET PLAYER NAME GENERATOR FALLBACKS ---
const RANDOM_FIRST_NAMES_IND = [
  'Amit', 'Rahul', 'Rohit', 'Sandeep', 'Deepak', 'Vijay', 'Suresh', 'Manish', 'Hardik', 'Krunal', 
  'Abhishek', 'Prithvi', 'Yash', 'Rinku', 'Shubman', 'Ishan', 'Dhruv', 'Jitesh', 'Sanju', 'Shivam', 
  'Karan', 'Devdutt', 'Mayank', 'Ajinkya', 'Dinesh', 'Robin', 'Piyush', 'Varun', 'Ravi', 'Akash', 
  'Yashasvi', 'Ruturaj', 'Tilak', 'Ayush', 'Harshal', 'Bhuvneshwar', 'Umesh', 'Mohit', 'Jaydev', 
  'Prasidh', 'Arshdeep', 'Mohammed', 'Tushar', 'Mukesh', 'Chetan', 'Khaleel', 'Avesh', 'Karthik', 
  'Saurabh', 'Shahrukh', 'Venkatesh', 'Shardul', 'Suryakumar', 'Shreyas', 'Rajat', 'Jasprit', 
  'Kuldeep', 'Ravichandran', 'Yuzvendra', 'Axar', 'Riyan', 'Anuj', 'Harpreet', 'Mahipal', 'Atharva'
];
const RANDOM_LAST_NAMES_IND = [
  'Sharma', 'Kohli', 'Yadav', 'Iyer', 'Gill', 'Pandya', 'Jadeja', 'Pant', 'Rahul', 'Samson', 
  'Kishan', 'Bumrah', 'Shami', 'Chahal', 'Ashwin', 'Siraj', 'Singh', 'Chahar', 'Patel', 'Kumar', 
  'Gaikwad', 'Jaiswal', 'Dube', 'Tewatia', 'Rinku', 'Varma', 'Badoni', 'Jurel', 'Mishra', 'Chawla', 
  'Bishnoi', 'Chakravarthy', 'Krishna', 'Sen', 'Roy', 'Rana', 'Tripathi', 'Sudharsan', 'Agarwal', 
  'Dhawan', 'Shaw', 'Padikkal', 'Nair', 'Pandey', 'Rayudu', 'Thakur', 'Sundar', 'Madhwal', 'Dayal'
];

const RANDOM_FIRST_NAMES_OS = [
  'David', 'Steve', 'Mitchell', 'Glenn', 'Travis', 'Marcus', 'Ben', 'Sam', 'Jos', 'Jonny', 
  'Phil', 'Quinton', 'Heinrich', 'Kagiso', 'Anrich', 'Trent', 'Devon', 'Daryl', 'Rachin', 'Nicholas', 
  'Andre', 'Sunil', 'Rashid', 'Mohammad', 'Fazalhaq', 'Naveen', 'Matheesha', 'Wanindu', 'Maheesh', 
  'Shakib', 'Mustafizur', 'Kane', 'Aiden', 'Harry', 'Liam', 'Chris', 'Jason', 'Alex', 'Tom', 'Mark', 
  'Lockie', 'Tim', 'Rovman', 'Shimron', 'Alzarri', 'Obed', 'Rahmanullah', 'Sikandar', 'Bas', 'Finn'
];
const RANDOM_LAST_NAMES_OS = [
  'Warner', 'Smith', 'Starc', 'Maxwell', 'Head', 'Stoinis', 'Stokes', 'Curran', 'Buttler', 'Bairstow', 
  'Salt', 'de Kock', 'Klaasen', 'Rabada', 'Nortje', 'Boult', 'Conway', 'Mitchell', 'Ravindra', 'Pooran', 
  'Russell', 'Narine', 'Khan', 'Nabi', 'Farooqi', 'ul-Haq', 'Pathirana', 'Hasaranga', 'Theekshana', 
  'Al Hasan', 'Rahman', 'Williamson', 'Markram', 'Brook', 'Livingstone', 'Woakes', 'Roy', 'Hales', 
  'Wood', 'Ferguson', 'Southee', 'Holder', 'Powell', 'Hetmyer', 'Joseph', 'McCoy', 'Gurbaz', 'Raza'
];

const RANDOM_COUNTRIES_OS = [
  { code: 'AUS', countryName: 'Australia', flag: '🇦🇺', isOverseas: true },
  { code: 'RSA', countryName: 'South Africa', flag: '🇿🇦', isOverseas: true },
  { code: 'ENG', countryName: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', isOverseas: true },
  { code: 'NZL', countryName: 'New Zealand', flag: '🇳🇿', isOverseas: true },
  { code: 'WI', countryName: 'West Indies', flag: '🌴', isOverseas: true },
  { code: 'AFG', countryName: 'Afghanistan', flag: '🇦🇫', isOverseas: true },
  { code: 'SL', countryName: 'Sri Lanka', flag: '🇱🇰', isOverseas: true }
];

const generateFallbackName = () => {
  const isOverseas = Math.random() > 0.65;
  if (isOverseas) {
    const first = RANDOM_FIRST_NAMES_OS[Math.floor(Math.random() * RANDOM_FIRST_NAMES_OS.length)];
    const last = RANDOM_LAST_NAMES_OS[Math.floor(Math.random() * RANDOM_LAST_NAMES_OS.length)];
    const country = RANDOM_COUNTRIES_OS[Math.floor(Math.random() * RANDOM_COUNTRIES_OS.length)];
    return {
      name: `${first} ${last}`,
      ...country
    };
  } else {
    const first = RANDOM_FIRST_NAMES_IND[Math.floor(Math.random() * RANDOM_FIRST_NAMES_IND.length)];
    const last = RANDOM_LAST_NAMES_IND[Math.floor(Math.random() * RANDOM_LAST_NAMES_IND.length)];
    return {
      name: `${first} ${last}`,
      code: 'IND',
      countryName: 'India',
      flag: '🇮🇳',
      isOverseas: false
    };
  }
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

  const getNameObj = (tier, role) => {
    if (pools[tier][role].length > 0) return { name: pools[tier][role].pop() };
    if (tier === 'MARQUEE' && pools['CAPPED'][role].length > 0) return { name: pools['CAPPED'][role].pop() };
    if (tier === 'CAPPED' && pools['UNCAPPED'][role].length > 0) return { name: pools['UNCAPPED'][role].pop() };
    return generateFallbackName();
  };

  let generatedPool = [];
  let idCounter = 1;

  POOL_CATEGORIES.forEach(category => {
    for (let i = 0; i < 20; i++) {
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
      const nameObj = getNameObj(category.tier, role);

      generatedPool.push({
        id: `pool_${idCounter++}`,
        setId: category.id,
        setName: category.name,
        name: nameObj.name,
        role: role,
        basePrice: basePrice,
        rating: rating,
        status: 'AVAILABLE',
        boughtBy: null,
        price: null,
        isOverseas: nameObj.isOverseas,
        countryName: nameObj.countryName,
        flag: nameObj.flag,
        code: nameObj.code
      });
    }
  });

  // Strict sorting logic: Set Hierarchy -> Base Price (Desc) -> Alphabetical (Asc)
  generatedPool.sort((a, b) => {
    if (a.setId !== b.setId) return a.setId - b.setId;
    if (b.basePrice !== a.basePrice) return b.basePrice - a.basePrice;
    return a.name.localeCompare(b.name);
  });

  return generatedPool;
};
