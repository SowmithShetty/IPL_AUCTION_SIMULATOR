// --- NATIONALITY MAPPING DICTIONARY ---
const AU = ['D. Warner', 'S. Smith', 'T. Head', 'M. Labuschagne', 'T. David', 'C. Green', 'M. Stoinis', 'G. Maxwell', 'P. Cummins', 'M. Starc', 'J. Hazlewood', 'A. Zampa', 'M. Wade', 'A. Carey', 'J. Inglis', 'S. Abbott', 'N. Ellis', 'K. Richardson', 'J. Behrendorff', 'R. Meredith', 'A. Turner', 'M. Short', 'J. Fraser-McGurk', 'M. Harris', 'N. Maddinson', 'M. Bryant', 'H. Cartwright', 'S. Heazlett', 'J. Weatherald', 'J. Sangha', 'D. Christian', 'A. Agar', 'M. Neser', 'J. Wildermuth', 'A. Hardie', 'B. Webster', 'S. Watson', 'M. Henriques', 'S. Marsh', 'P. Handscomb', 'B. McDermott', 'S. Harper', 'J. Peirson', 'S. Whiteman', 'C. Bancroft', 'M. Gilkes', 'H. Nielsen', 'S. Gotch', 'A. Gilchrist', 'B. Haddin', 'T. Paine', 'P. Nevill', 'B. Lee', 'S. Warne', 'M. Johnson', 'M. Steketee', 'J. Paris', 'W. Agar', 'B. Dwarshuis', 'B. Stanlake', 'M. Hussey', 'C. Lynn', 'D. Short', 'M. Klinger', 'J. Pattinson', 'C. Tremain', 'D. Sams'];
const ZA = ['F. du Plessis', 'D. Miller', 'A. Markram', 'R. Rossouw', 'H. Klaasen', 'Q. de Kock', 'T. Stubbs', 'R. Rickelton', 'K. Rabada', 'A. Nortje', 'M. Jansen', 'L. Ngidi', 'G. Coetzee', 'N. Burger', 'D. Brevis', 'A. Phehlukwayo', 'W. Parnell', 'M. de Lange', 'K. Abbott', 'D. Wiese', 'G. Roelofsen', 'C. Fortuin', 'S. Erwee', 'M. Breetzke', 'R. Hendricks', 'I. Tahir'];
const EN = ['J. Buttler', 'J. Bairstow', 'P. Salt', 'B. Stokes', 'S. Curran', 'M. Ali', 'L. Livingstone', 'J. Archer', 'M. Wood', 'H. Brook', 'W. Jacks', 'B. Duckett', 'C. Woakes', 'R. Topley', 'S. Billings', 'J. Roy', 'A. Hales', 'L. Evans', 'O. Pope', 'D. Malan', 'A. Hose', 'S. Hain', 'T. Kohler-Cadmore', 'J. Vince', 'D. Bell-Drummond', 'J. Denly', 'M. Holden', 'C. Jordan', 'T. Mills', 'R. Gleeson', 'D. Willey', 'M. Parkinson', 'C. Parkinson', 'L. Wood', 'S. Mahmood', 'R. Bopara', 'L. Gregory', 'C. Overton', 'P. Walter', 'T. Banton', 'J. Cox', 'A. Rossington', 'J. Clarke', 'A. Davies', 'T. Moores', 'R. Davies', 'O. Robinson', 'T. Curran', 'J. Overton', 'A. Rashid', 'J. Root'];
const NZ = ['K. Williamson', 'D. Conway', 'R. Ravindra', 'T. Boult', 'L. Ferguson', 'M. Santner', 'D. Mitchell', 'G. Phillips', 'T. Southee', 'M. Henry', 'K. Jamieson', 'M. Guptill', 'C. Munro', 'J. Neesham', 'M. Bracewell', 'H. Kerr', 'D. Cleaver', 'T. Seifert', 'T. Blundell', 'A. Milne', 'I. Sodhi', 'L. Ronchi'];
const WI = ['A. Russell', 'S. Narine', 'N. Pooran', 'J. Holder', 'K. Mayers', 'R. Powell', 'S. Hetmyer', 'R. Shepherd', 'A. Joseph', 'O. McCoy', 'K. Pollard', 'E. Lewis', 'B. King', 'S. Hope', 'R. Cornwall', 'K. Paul', 'A. Fletcher', 'J. Charles', 'S. Dowrich', 'K. Roach', 'R. Rampaul', 'O. Thomas', 'S. Cottrell', 'K. Williams', 'R. Emrit', 'D. Drake', 'A. Hosein', 'K. Pierre', 'F. Allen'];
const AF = ['R. Khan', 'M. Nabi', 'R. Gurbaz', 'F. Farooqi', 'N. Ul-Haq', 'A. Omarzai', 'N. Ahmad', 'G. Naib', 'K. Janat'];
const LK = ['M. Pathirana', 'M. Theekshana', 'W. Hasaranga', 'D. Chameera', 'M. Bhanuka', 'C. Asalanka', 'K. Mendis', 'D. Shanaka', 'P. Nissanka', 'T. Perera', 'A. Mathews', 'K. Perera'];
const BD = ['S. Al Hasan', 'M. Rahman', 'L. Das', 'T. Ahmed'];
const IE = ['J. Little', 'P. Stirling', 'L. Tucker'];
const ZW = ['S. Raza', 'S. Williams', 'C. Madande', 'P. Moor'];
const NL = ['C. de Leede'];
const SCO = ['M. Cross'];
const USA = ['S. Taylor'];

export const getPlayerCountryInfo = (name) => {
  if (AU.includes(name)) return { code: 'AUS', countryName: 'Australia', flag: '🇦🇺', isOverseas: true };
  if (ZA.includes(name)) return { code: 'RSA', countryName: 'South Africa', flag: '🇿🇦', isOverseas: true };
  if (EN.includes(name)) return { code: 'ENG', countryName: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', isOverseas: true };
  if (NZ.includes(name)) return { code: 'NZL', countryName: 'New Zealand', flag: '🇳🇿', isOverseas: true };
  if (WI.includes(name)) return { code: 'WI', countryName: 'West Indies', flag: '🌴', isOverseas: true };
  if (AF.includes(name)) return { code: 'AFG', countryName: 'Afghanistan', flag: '🇦🇫', isOverseas: true };
  if (LK.includes(name)) return { code: 'SL', countryName: 'Sri Lanka', flag: '🇱🇰', isOverseas: true };
  if (BD.includes(name)) return { code: 'BAN', countryName: 'Bangladesh', flag: '🇧🇩', isOverseas: true };
  if (IE.includes(name)) return { code: 'IRE', countryName: 'Ireland', flag: '🇮🇪', isOverseas: true };
  if (ZW.includes(name)) return { code: 'ZIM', countryName: 'Zimbabwe', flag: '🇿🇼', isOverseas: true };
  if (NL.includes(name)) return { code: 'NED', countryName: 'Netherlands', flag: '🇳🇱', isOverseas: true };
  if (SCO.includes(name)) return { code: 'SCO', countryName: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', isOverseas: true };
  if (USA.includes(name)) return { code: 'USA', countryName: 'USA', flag: '🇺🇸', isOverseas: true };

  return { code: 'IND', countryName: 'India', flag: '🇮🇳', isOverseas: false };
};
