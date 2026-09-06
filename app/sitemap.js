import { createMatchSlug } from '@/lib/utils/slug';

const BASE_URL = 'https://footzero.vercel.app';

async function getAllMatches() {
  try {
    // try to fetch from your api
    const res = await fetch(`${BASE_URL}/api/matches`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.matches || data || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const matches = await getAllMatches();

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
