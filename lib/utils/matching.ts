export const COMMON_WORDS = new Set([
  'fc', 'cf', 'ac', 'sc', 'afc', 'ssc', 'ud', 'cd',
  'de', 'del', 'da', 'do', 'dos', 'das', 'e', 'o', 'a', 'as', 'os',
  'the', 'and', 'vs', 'v', 'x', 'club', 'team', 'real', 'united',
  'city', 'young', 'boys', 'old'
]);

export const LEAGUE_TIERS: string[][] = [
  // Tier 0: World Events
  ['world cup', 'fifa'],
  // Tier 1: Continental Championships
  [
    'uefa champions league', 'uefa europa league', 'uefa euro', 'uefa nations',
    'european championship', 'euro', 'champions league',
    'copa libertadores', 'copa sudamericana', 'conmebol',
    'copa america', 'africa cup of nations', 'caf', 'asian cup', 'afc',
    'concacaf gold cup'
  ],
  // Tier 2: Top Domestic Leagues
  [
    'premier league', 'la liga', 'serie a', 'bundesliga', 'ligue 1',
    'primeira liga', 'eredivisie', 'belgian pro league',
    'brasileiro', 'liga mx', 'mls', 'argentinian', 'colombian',
    'scottish premiership', 'swiss super league'
  ],
  // Tier 3: Other Recognized Leagues
  [
    'superettan', 'allsvenskan', 'eliteserien', 'obos-ligaen', 'veikkausliiga',
    'premium liiga', 'virsliga', 'niké liga', 'austrian bundesliga'
  ],
  // Tier 4: Lower Tiers
  [
    'serie b', 'liga profesional', 'primera division', 'segunda division'
  ]
];

export const LEAGUE_COUNTRIES: Record<string, string> = {
  // Specific country leagues FIRST (before generic patterns)
  'ethiopian premier': 'Ethiopia', 'ethiopian league': 'Ethiopia',
  'ugandan premier': 'Uganda', 'ugandan league': 'Uganda',
  'kenyan premier': 'Kenya', 'kenyan league': 'Kenya',
  'tanzanian premier': 'Tanzania', 'tanzanian league': 'Tanzania',
  'nigerian league': 'Nigeria', 'nigerian premier': 'Nigeria',
  'ghana premier': 'Ghana', 'ghanaian premier': 'Ghana',
  'south african premier': 'South Africa', 'south african': 'South Africa',
  'cosmopolitan': 'South Africa',
  'zambian super': 'Zambia', 'zimbabwean premier': 'Zimbabwe',
  'cameroonian premier': 'Cameroon', 'ivorian ligue': 'Ivory Coast',
  'senegalese ligue': 'Senegal', 'egyptian premier': 'Egypt',
  'moroccan botola': 'Morocco', 'tunisian ligue': 'Tunisia',
  'algerian ligue': 'Algeria', 'libyan premier': 'Libya',
  'sudanese premier': 'Sudan', 'congo premier': 'Congo',
  'angolan girabola': 'Angola', 'mozambican mocambola': 'Mozambique',
  'belarusian premier': 'Belarus', 'belarusian cup': 'Belarus',
  'armenian first': 'Armenia', 'iraqi league': 'Iraq',
  'yemeni league': 'Yemen', 'georgian': 'Georgia',
  'erovnuli liga': 'Georgia',
  // European leagues
  'english premier league': 'England', 'english league': 'England',
  'english fa cup': 'England', 'english league cup': 'England',
  'french coupe': 'France', 'french ligue': 'France', 'ligue 2': 'France',
  'coupe de tunisie': 'Tunisia',
  'italian serie': 'Italy', 'italian coppa': 'Italy',
  'spanish copa': 'Spain', 'spanish la': 'Spain',
  'german bundesliga': 'Germany', 'austrian bundesliga': 'Austria',
  'regionalliga': 'Germany',
  'belgian pro': 'Belgium', 'belgian cup': 'Belgium',
  'dutch knvb': 'Netherlands', 'dutch eredivisie': 'Netherlands',
  'norwegian eliteserien': 'Norway', 'norwegian cup': 'Norway',
  'norsk tipping': 'Norway', 'nm kvinner': 'Norway',
  'swedish allsvenskan': 'Sweden', 'swedish cup': 'Sweden',
  'damallsvenskan': 'Sweden',
  'danish superliga': 'Denmark', 'danish cup': 'Denmark',
  'finnish veikkausliiga': 'Finland', 'finnish cup': 'Finland',
  'estonian premium': 'Estonia', 'estonian cup': 'Estonia',
  'latvian virslunga': 'Latvia', 'latvian cup': 'Latvia', 'virsliga': 'Latvia',
  'lithuanian cup': 'Lithuania', 'lithuanian first': 'Lithuania',
  'montenegrin first': 'Montenegro', 'montenegrin cup': 'Montenegro',
  'serbian superliga': 'Serbia', 'serbian cup': 'Serbia',
  'croatian hnl': 'Croatia', 'croatian cup': 'Croatia',
  'slovenian prva': 'Slovenia', 'slovenian cup': 'Slovenia',
  'polish ekstraklasa': 'Poland', 'polish cup': 'Poland',
  'czech cup': 'Czech Republic', 'czech league': 'Czech Republic', 'mol cup': 'Czech Republic',
  'hungarian cup': 'Hungary', 'hungarian league': 'Hungary',
  'romanian liga': 'Romania', 'romanian cup': 'Romania',
  'bulgarian cup': 'Bulgaria', 'bulgarian league': 'Bulgaria',
  'greek super league': 'Greece', 'greek cup': 'Greece',
  'turkish super lig': 'Turkey', 'turkish cup': 'Turkey',
  'saudi pro league': 'Saudi Arabia', 'saudi king cup': 'Saudi Arabia',
  'emirates league': 'UAE', 'qatari league': 'Qatar',
  'israeli premier': 'Israel', 'israeli cup': 'Israel', 'liga leumit': 'Israel',
  'cypriot league': 'Cyprus', 'cypriot cup': 'Cyprus',
  'irish premier': 'Ireland', 'irish cup': 'Ireland',
  'welsh premier': 'Wales', 'welsh cup': 'Wales',
  'scottish premiership': 'Scotland', 'scottish championship': 'Scotland',
  'swiss super league': 'Switzerland', 'swiss cup': 'Switzerland',
  'portuguese primeira': 'Portugal', 'primeira liga': 'Portugal',
  'niké liga': 'Slovakia',
  'parva liga': 'Bulgaria', 'ekstraklasa': 'Poland', 'ligat ha\'al': 'Israel',
  'liga i': 'Romania', 'superliga': 'Serbia',
  'liga argentina': 'Argentina', 'copa argentina': 'Argentina',
  'torneo de reservas': 'Argentina',
  'copa colombia': 'Colombia', 'colombian primera': 'Colombia', 'colombian women': 'Colombia',
  'copa ecuador': 'Ecuador', 'ligapro ecuador': 'Ecuador',
  'copa do nordeste': 'Brazil',
  'copa verde': 'Brazil', 'copa espirito santo': 'Brazil',
  'copa fgf': 'Brazil', 'copa liberta': 'South America',
  'conmebol libertadores': 'South America',
  'copa sudamericana': 'South America', 'conmebol sudamericana': 'South America',
  'brasileiro': 'Brazil', 'carioca': 'Brazil', 'catarinense': 'Brazil',
  'cearense': 'Brazil', 'liga revelacao': 'Portugal',
  'liga futve': 'Venezuela', 'divisional c': 'Chile',
  'division intermedia': 'Paraguay', 'lpr pro': 'Mexico',
  'liga nacional': 'Guatemala',
  'uefa europa league': 'Europe', 'uefa champions league': 'Europe', 'uefa nations league': 'Europe',
  'champions league': 'Europe', 'europa league': 'Europe',
  'world cup': 'World', 'fifa world cup': 'World',
  'copa america': 'South America', 'africa cup of nations': 'Africa',
  'caf': 'Africa', 'asian cup': 'Asia', 'afc': 'Asia',
  'concacaf': 'North America', 'us open cup': 'USA',
  'usl': 'USA',
  'indian super league': 'India', 'i-league': 'India',
  'chinese super league': 'China', 'j-league': 'Japan',
  'k-league': 'South Korea', 'a-league': 'Australia',
  'ofc pro league': 'Oceania', 'caribbean': 'Caribbean',
  'asean club': 'Asia', 'concacaf w': 'North America',
  'club friendlies': 'International', 'women league': 'Women',
  // Generic league names (checked LAST)
  'premier league': 'England', 'la liga': 'Spain', 'serie a': 'Italy',
  'bundesliga': 'Germany', 'ligue 1': 'France',
  'eredivisie': 'Netherlands', 'liga mx': 'Mexico',
  'mls': 'USA', 'superettan': 'Sweden', 'allsvenskan': 'Sweden',
  'eliteserien': 'Norway', 'obos-ligaen': 'Norway', 'veikkausliiga': 'Finland',
  'premium liiga': 'Estonia',
  'liga profesional reserva': 'Argentina', 'reserve': '', 'u20': '', 'u17': '',
  'under-20': '', 'under-17': '', 'women': 'Women',
  'premier league summer': 'International',
};

export function getLeaguePriority(leagueName: string): number {
  const lower = leagueName.toLowerCase();
  
  for (let tier = 0; tier < LEAGUE_TIERS.length; tier++) {
    for (const keyword of LEAGUE_TIERS[tier]) {
      if (lower.includes(keyword)) {
        return tier;
      }
    }
  }
  return LEAGUE_TIERS.length;
}

export function getCountryForLeague(leagueName: string): string {
  const lower = leagueName.toLowerCase();
  
  if (lower.includes('reserve') || lower.includes('res.') || lower.includes(' u') || lower.includes('u-')) {
    return '';
  }
  if (lower.includes('women') || lower.includes('w ')) {
    return 'Women';
  }
  
  for (const [key, country] of Object.entries(LEAGUE_COUNTRIES)) {
    if (lower.includes(key)) {
      return country;
    }
  }
  
  return '';
}

export function normalizeTeamName(name: string): string {
  if (!name) return '';
  const lower = name.toLowerCase().trim();
  let cleaned = lower
    .replace(/\b(fc|cf|sc|ac|afc|ssc|ud|cd|ec|rc|assoc|atletico|atlético)\b/g, '')
    .replace(/\b(team|club|real|sport|sporting|racing|race|union|united|city)\b/g, '')
    .replace(/['´`]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
}

export function extractTeamNames(title: string): { home: string; away: string } {
  const parts = title.split(/\s+vs\s+|\s+-\s+|\s+x\s+/i);
  if (parts.length >= 2) {
    return { home: parts[0].trim(), away: parts[1].trim() };
  }
  const words = title.trim().split(/\s+/);
  if (words.length >= 4) {
    const mid = Math.floor(words.length / 2);
    return { home: words.slice(0, mid).join(' '), away: words.slice(mid).join(' ') };
  }
  return { home: title.trim(), away: '' };
}

export function getSignificantWords(name: string): string[] {
  const words = name.toLowerCase().split(/\s+/);
  const sig: string[] = [];
  for (const w of words) {
    const clean = w.replace(/[^a-z0-9]/g, '');
    if (clean.length > 2 && !COMMON_WORDS.has(clean)) {
      sig.push(clean);
    }
  }
  return sig;
}

export function teamSimilarity(teamA: string, teamB: string): number {
  const aNorm = normalizeTeamName(teamA);
  const bNorm = normalizeTeamName(teamB);
  
  if (!aNorm || !bNorm) return 0;

  if (aNorm === bNorm) return 2.0;
  
  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) return 1.5;

  const aClean = teamA.toLowerCase().replace(/[^a-z0-9]/g, '');
  const bClean = teamB.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (aClean.includes(bClean) || bClean.includes(aClean)) return 1.5;

  const aSig = getSignificantWords(teamA);
  const bSig = getSignificantWords(teamB);

  if (aSig.length === 0 || bSig.length === 0) return 0;

  let overlap = 0;
  for (const w of aSig) {
    if (bSig.includes(w)) overlap++;
  }

  if (overlap >= 2) return 1.5;
  if (overlap === 1 && aSig[0].length > 4) return 1.0;
  
  return 0;
}

export function teamsMatch(title1: string, title2: string): boolean {
  if (!title1 || !title2) return false;
  
  const t1 = extractTeamNames(title1);
  const t2 = extractTeamNames(title2);

  if (!t1.home && !t1.away) return false;
  if (!t2.home && !t2.away) return false;

  let homeScore = 0;
  if (t1.home) {
    homeScore = Math.max(
      teamSimilarity(t1.home, t2.home),
      teamSimilarity(t1.home, t2.away)
    );
  }

  let awayScore = 0;
  if (t1.away) {
    awayScore = Math.max(
      teamSimilarity(t1.away, t2.home),
      teamSimilarity(t1.away, t2.away)
    );
  }

  const bestScore = homeScore + awayScore;

  return bestScore >= 2.0 && homeScore >= 0.5 && awayScore >= 0.5;
}
