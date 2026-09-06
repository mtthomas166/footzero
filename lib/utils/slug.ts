import type { Match } from '../types';

export function slugify(text: string) {
  if (!text) return 'team';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

export function createMatchSlug(match: Match) {
  const home = slugify(match.homeTeam?.name || 'home');
  const away = slugify(match.awayTeam?.name || 'away');
  return `${home}-vs-${away}-${match.id}`;
}

export function extractIdFromSlug(slug: string) {
  if (!slug) return '';
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
