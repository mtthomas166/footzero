'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, Flame, Calendar, Star, ChevronLeft, ChevronRight, Trophy as TrophyIcon, Clock } from 'lucide-react';
import MatchCard from './MatchCard';
import { useRouter } from 'next/navigation';
import { getFavoriteTeams } from '@/lib/utils/favorites';

const LEAGUE_IMPORTANCE = {
  'Premier League': 10,
  'Champions League': 10,
  'La Liga': 9,
  'Bundesliga': 9,
  'Serie A': 9,
  'Europa League': 8,
};

// Blacklist keywords for second / third division
const SECOND_TIER_KEYWORDS = [
  '2nd division',
  '3rd division',
  'division 2',
  'division 3',
  '2. bundesliga',
  '3. liga',
  'serie b',
  'serie c',
  'segunda division',
  'segunda b',
  'liga 2',
  'ligue 2',
  'league 2',
  'league two',
  'league one',
  'championship', // English Championship = 2nd tier
  'primera b',
  'nacional b',
  'j2 league',
  'k league 2',
  'k2 league',
  'reserve',
  'reserves',
  'b team',
  ' u21',
  'u-21',
  'u19',
  'u-19',
  'u23',
  'u-23',
  'youth',
  'academy',
  'women',
  'feminina',
];

function isFirstDivision(tournamentName) {
  if (!tournamentName) return true;
  const lower = tournamentName.toLowerCase();

  // Check blacklist
  for (const keyword of SECOND_TIER_KEYWORDS) {
    if (lower.includes(keyword)) {
      return false;
    }
  }

  // Check patterns like "Premier League 2", "LaLiga 3", "Club II"
  if (/\s2\s*$/.test(lower) || /\s3\s*$/.test(lower)) return false;
  if (/\bii\b/.test(lower) || /\biii\b/.test(lower)) return false;
  if (/\b2$/.test(lower) &&!lower.includes('ligue 1') &&!lower.includes('liga 1')) {
    // catches "Bundesliga 2", "Ligue 2" already handled but safe
    if (lower.match(/(bundesliga|ligue|liga|serie|league)\s*2/)) return false;
  }

  return true;
}

function sortMatches(matches, sortBy) {
  const sorted = [...matches];
  switch (sortBy) {
    case 'league':
      return sorted.sort((a, b) => (a.tournament || '').localeCompare(b.tournament || ''));
    case 'time':
      return sorted.sort((a, b) => {
        const ta = a.timestamp? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp? new Date(b.timestamp).getTime() : 0;
        return ta - tb;
      });
    case 'importance':
      return sorted.sort((a, b) => {
        const aLive = a.status === 'live'? 100 : 0;
        const bLive = b.status === 'live'? 100 : 0;
        const aImp = LEAGUE_IMPORTANCE[a.tournament] || 1;
        const bImp = LEAGUE_IMPORTANCE[b.tournament] || 1;
        if (aLive!== bLive) return bLive - aLive;
        if (aImp!== bImp) return bImp - aImp;
        const ta = a.timestamp? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp? new Date(b.timestamp).getTime() : 0;
        return ta - tb;
      });
    default:
      return sorted;
  }
}

function Ball({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.2">
      <circle cx="12" cy="12" r="9" className="stroke-violet-500/10" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" className="stroke-violet-500/10" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" className="stroke-violet-500/10" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" className="stroke-violet-500/10" />
      <circle cx="12" cy="12" r="2.5" className="fill-violet-500/10" opacity="0.4" />
    </svg>
  );
}

function Trophy({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v4a6 6 0 0 1-12 0V3z" className="stroke-emerald-500/10" />
      <path d="M8 3a4 4 0 0 0-4 4 3 3 0 0 0 3 3h1" className="stroke-emerald-500/10" />
      <path d="M16 3a4 4 0 0 1 4 4 3 3 0 0 1-3 3h-1" className="stroke-emerald-500/10" />
      <path d="M12 14v4" className="stroke-emerald-500/10" />
      <path d="M8 21h8" className="stroke-emerald-500/10" />
    </svg>
  );
}

export default function MatchGrid({ matches, defaultTab }) {
  const router = useRouter();
  const [tab, setTab] = useState(defaultTab);
  const [search, setSearch] = useState('');
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('time');

  const scrollRef = useRef(null);

  const scrollLeagues = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === 'left'? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const interval = setInterval(() => { router.refresh(); }, 20000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const updateFavs = () => {
      setFavorites(getFavoriteTeams());
    };
    updateFavs();
    window.addEventListener('favorites-updated', updateFavs);
    return () => {
      window.removeEventListener('favorites-updated', updateFavs);
    };
  }, []);

  const enrichedMatches = useMemo(() => {
    return matches.map(m => {
      if (m.status === 'upcoming') {
        const now = Date.now();
        const kickoffTime = m.timestamp? new Date(m.timestamp).getTime() : 0;
        const diffMinutes = kickoffTime? Math.floor((now - kickoffTime) / 60000) : -1;
        if (kickoffTime && diffMinutes >= 0 && diffMinutes < 125) {
          let currentMinuteNumber = m.currentMinuteNumber || 0;
          let currentMinute = m.currentMinute || '';
          if (diffMinutes < 45) {
            currentMinuteNumber = diffMinutes;
            currentMinute = `${diffMinutes}'`;
          } else if (diffMinutes >= 45 && diffMinutes < 60) {
            currentMinuteNumber = 45;
            currentMinute = 'HT';
          } else if (diffMinutes >= 60 && diffMinutes < 105) {
            currentMinuteNumber = diffMinutes - 15;
            currentMinute = `${diffMinutes - 15}'`;
          } else {
            currentMinuteNumber = 90;
            currentMinute = '90+';
          }
          return {
           ...m,
            status: 'live',
            currentMinute,
            currentMinuteNumber,
          };
        }
      }
      return m;
    });
  }, [matches]);

  const live = useMemo(() => enrichedMatches.filter(m => m.status === 'live'), [enrichedMatches]);
  const upcoming = useMemo(() => enrichedMatches.filter(m => m.status === 'upcoming'), [enrichedMatches]);

  const baseMatches = tab === 'upcoming'? upcoming : live;

  // NEW: Keep only first division
  const firstDivisionMatches = useMemo(() => {
    return baseMatches.filter(m => isFirstDivision(m.tournament));
  }, [baseMatches]);

  const leaguesWithLogos = useMemo(() => {
    const leagueMap = new Map();
    for (const m of firstDivisionMatches) {
      if (m.tournament &&!leagueMap.has(m.tournament)) {
        leagueMap.set(m.tournament, { name: m.tournament, logo: m.leagueLogo || '' });
      }
    }
    return Array.from(leagueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [firstDivisionMatches]);

  useEffect(() => {
    setSelectedLeagues(prev => prev.filter(name => leaguesWithLogos.some(l => l.name === name)));
  }, [leaguesWithLogos]);

  const filtered = useMemo(() => {
    let result = firstDivisionMatches;
    if (selectedLeagues.length > 0) {
      result = result.filter(m => selectedLeagues.includes(m.tournament));
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(m =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.tournament.toLowerCase().includes(q)
      );
    }
    return result;
  }, [firstDivisionMatches, selectedLeagues, search]);

  const sortedFiltered = useMemo(() => {
    return sortMatches(filtered, sortBy);
  }, [filtered, sortBy]);

  const { starredMatches, normalMatches } = useMemo(() => {
    const starred = [];
    const normal = [];
    for (const m of sortedFiltered) {
      const isHomeFav = favorites.some(f => f.toLowerCase() === m.homeTeam?.name?.toLowerCase());
      const isAwayFav = favorites.some(f => f.toLowerCase() === m.awayTeam?.name?.toLowerCase());
      if (isHomeFav || isAwayFav) {
        starred.push(m);
      } else {
        normal.push(m);
      }
    }
    return { starredMatches: starred, normalMatches: normal };
  }, [sortedFiltered, favorites]);

  return (
    <div className="space-y-8 relative">
      <Ball className="fixed left-6 top-28 h-20 w-20 opacity-40 rotate-12 hidden xl:block animate-pulse-slow" />
      <Trophy className="fixed right-6 top-32 h-20 w-20 opacity-40 rotate-45 hidden xl:block animate-pulse-slow" />

      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-r from-white via-zinc-50/50 to-white dark:from-zinc-950 dark:via-[#0d0d12] dark:to-zinc-950 px-6 py-8 shadow-md dark:shadow-xl transition-all duration-350">
        <div className="absolute top-0 right-0 w- h-full bg-gradient-to-l from-violet-500/5 dark:from-violet-600/10 to-transparent pointer-events-none filter blur-xl" />
        <div className="relative z-10 max-w-lg space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-450">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Live Sports Aggregator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Never Miss a Single Kick
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            High definition streams, real-time live scoreboards, and instant player metrics, aggregated into a clean ad-free experience.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-xl shadow-md dark:shadow-lg border border-zinc-200/80 dark:border-zinc-900/60">
        <div className="flex rounded-lg bg-zinc-200/60 dark:bg-zinc-950 p-1 border border-zinc-300/45 dark:border-zinc-800/80 max-w-xs shrink-0">
          <button
            onClick={() => setTab('live')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'live'
               ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${tab === 'live'? 'animate-pulse' : ''}`} />
            Live Now ({firstDivisionMatches.filter(m => m.status === 'live').length})
          </button>
          <button
            onClick={() => setTab('upcoming')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'upcoming'
               ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Upcoming ({firstDivisionMatches.filter(m => m.status === 'upcoming').length})
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 w-full sm:w-auto flex-1 sm:flex-initial">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search teams or leagues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl w-fit">
        <span className="text- font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 flex items-center gap-1">
          <Filter className="h-3 w-3" /> Sort By:
        </span>
        <button
          onClick={() => setSortBy('league')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            sortBy === 'league'? 'bg-violet-600 text-white shadow' : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
          }`}
        >
          <TrophyIcon className="h-3.5 w-3.5" /> By League
        </button>
        <button
          onClick={() => setSortBy('time')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            sortBy === 'time'? 'bg-violet-600 text-white shadow' : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
          }`}
        >
          <Clock className="h-3.5 w-3.5" /> By Kickoff Time
        </button>
        <button
          onClick={() => setSortBy('importance')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            sortBy === 'importance'? 'bg-violet-600 text-white shadow' : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
          }`}
        >
          <Flame className="h-3.5 w-3.5" /> By Importance
        </button>
      </div>

      {(() => {
        if (leaguesWithLogos.length === 0) return null;
        const isAllSelected = selectedLeagues.length === 0;
        return (
          <div className="space-y-3.5 p-4 sm:p-5 bg-white/80 dark:bg-[#08080c]/50 border border-zinc-200/80 dark:border-zinc-900/60 rounded-2xl shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <label className="text- font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-violet-500" />
                Filter by Tournament
              </label>
              {!isAllSelected && (
                <button
                  onClick={() => setSelectedLeagues([])}
                  className="text- font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors cursor-pointer"
                >
                  Reset view
                </button>
              )}
            </div>
            <div className="relative w-full overflow-hidden group/shelf">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 dark:from-[#08080c]/80 to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 dark:from-[#08080c]/80 to-transparent pointer-events-none z-10" />
              <button
                onClick={() => scrollLeagues('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 shadow-md hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/shelf:opacity-100 cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => scrollLeagues('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-violet-400 shadow-md hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/shelf:opacity-100 cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div
                ref={scrollRef}
                className="flex flex-row flex-nowrap overflow-x-auto gap-1.5 py-1.5 px-1 -mx-1 custom-horizontal-scrollbar scroll-smooth"
              >
                <button
                  onClick={() => setSelectedLeagues([])}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text- font-bold tracking-wide transition-all cursor-pointer border shrink-0 ${
                    isAllSelected
                     ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/20 scale-[1.02]'
                      : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:scale-[1.01]'
                  }`}
                >
                  <div className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${isAllSelected? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'}`}>
                    <Star className="h-2 w-2" />
                  </div>
                  <span>All Tournaments</span>
                </button>
                {leaguesWithLogos.map((l) => {
                  const isActive = selectedLeagues.includes(l.name);
                  const count = firstDivisionMatches.filter(m => m.tournament === l.name).length;
                  return (
                    <button
                      key={l.name}
                      onClick={() => {
                        setSelectedLeagues(prev =>
                          prev.includes(l.name)? prev.filter(name => name!== l.name) : [...prev, l.name]
                        );
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text- font-bold tracking-wide transition-all cursor-pointer border shrink-0 ${
                        isActive
                         ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/20 scale-[1.02]'
                          : 'bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:scale-[1.01]'
                      }`}
                    >
                      {l.logo? (
                        <img
                          src={l.logo}
                          alt=""
                          className="h-3.5 w-3.5 rounded-full object-contain bg-zinc-50 dark:bg-zinc-900 p-0.5"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text- font-black ${isActive? 'bg-white/20' : 'bg-violet-500/10 text-violet-500'}`}>
                          {l.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span>{l.name}</span>
                      <span className={`text- px-1 py-0.2 rounded-md font-bold ${isActive? 'bg-white/20 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {sortedFiltered.length === 0? (
        <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-xl shadow-md">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 shadow-inner">
            <svg className="h-6 w-6 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-400">
            {search || selectedLeagues.length > 0? 'No matching fixtures found' : tab === 'live'? 'No live games running' : 'No upcoming fixtures scheduled'}
          </p>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-500 max-w-xs text-center leading-relaxed">
            {search || selectedLeagues.length > 0? 'Try adjusting search terms or clearing selected league filters.' : tab === 'live'? 'Browse the upcoming tab to see what is scheduled next.' : 'Check back later for updated fixtures.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {starredMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-500 dark:text-amber-400 animate-pulse">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                </div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Starred Team Fixtures</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-500/30 via-zinc-300 dark:via-zinc-800 to-transparent ml-2" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                {starredMatches.map(match => (
                  <MatchCard key={match.id} match={match} tab={tab} />
                ))}
              </div>
            </div>
          )}
          {normalMatches.length > 0 && (
            <div className="space-y-4">
              {starredMatches.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-200/85 border border-zinc-300/70 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Other Fixtures</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-zinc-300/80 dark:from-zinc-800/80 via-zinc-200/30 dark:via-zinc-900/30 to-transparent ml-2" />
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                {normalMatches.map(match => (
                  <MatchCard key={match.id} match={match} tab={tab} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}