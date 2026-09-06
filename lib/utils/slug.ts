import type { Match } from '../types';

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

export function createMatchSlug(match: Match) {
  const home = slugify(match.homeTeam?.name || 'team');
  const away = slugify(match.awayTeam?.name || 'team');
  return `${home}-vs-${away}-${match.id}`;
}

export function extractIdFromSlug(slug: string) {
  // ال id هو اخر حاجة بعد اخر -
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
