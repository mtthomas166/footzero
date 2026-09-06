import logger from '../logger';

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { 
      signal: controller.signal, 
      next: { revalidate: 30 },
      headers: { 'Accept': 'application/json' }
    } as any);
    if (res.status === 429) {
      logger.warn(`Rate limited by external provider API`, { url: url.split('/')[2] });
      return [];
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
