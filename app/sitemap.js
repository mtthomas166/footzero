import { createMatchSlug } from '@/lib/utils/slug';

const BASE_URL = 'https://footzero-es32.vercel.app';

export default async function sitemap() {
  let matches = [];

  try {
    // try to load matches directly from your engine
    const engine = await import('@/lib/streamEngine');
    
    if (typeof engine.getAllMatches === 'function') {
      matches = await engine.getAllMatches();
    } else if (typeof engine.getLiveAndUpcomingMatches === 'function') {
      matches = await engine.getLiveAndUpcomingMatches();
    } else {
      const live = typeof engine.getLiveMatches === 'function' ? await engine.getLiveMatches() : [];
      const upcoming = typeof engine.getUpcomingMatches === 'function' ? await engine.getUpcomingMatches() : [];
      const cached = typeof engine.getCachedMatches === 'function' ? await engine.getCachedMatches() : [];
      matches = [...live, ...upcoming, ...cached];
      // remove duplicates by id
      const map = new Map();
      matches.forEach(m => { if (m && m.id) map.set(m.id, m); });
      matches = Array.from(map.values());
    }
  } catch (e) {
    console.error('sitemap fetch error', e);
    matches = [];
  }

  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${BASE_URL}/?tab=live`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/?tab=upcoming`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ];

  const matchPages = matches.map((match) => ({
    url: `${BASE_URL}/watch/${createMatchSlug(match)}`,
    lastModified: new Date(match.timestamp || Date.now()),
    changeFrequency: match.status === 'live' ? 'always' : 'hourly',
    priority: match.status === 'live' ? 0.9 : 0.7,
  }));

  return [...staticPages, ...matchPages];
}
