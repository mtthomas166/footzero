#!/usr/bin/env node
// Auto submit sitemap URLs to IndexNow (Bing / Yandex)
// Works after deploy - it fetches your live sitemap.xml

const KEY = process.env.INDEXNOW_KEY || '3287ea2024794c178fda50a2cf16d02e';
const HOST = 'footzero-es32.vercel.app';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

async function getUrlsFromSitemap() {
  try {
    console.log(`Fetching ${SITEMAP_URL}...`);
    const res = await fetch(SITEMAP_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sitemap fetch failed ${res.status}`);
    const xml = await res.text();
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
    // IndexNow allows max 10k per request
    const urls = [...new Set(matches)].slice(0, 10000);
    console.log(`Found ${urls.length} URLs in sitemap`);
    return urls;
  } catch (e) {
    console.error('Failed to fetch sitemap:', e.message);
    return [`https://${HOST}/`];
  }
}

async function submitToIndexNow(urlList) {
  if (!urlList.length) return;
  
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  };

  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);
  console.log(`Key location: ${KEY_LOCATION}`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log(`IndexNow response: ${res.status} - ${text}`);
  
  if (res.status === 200 || res.status === 202) {
    console.log('✅ IndexNow submitted successfully! Bing will crawl soon.');
  } else {
    console.error('❌ IndexNow failed. Make sure key file is accessible at', KEY_LOCATION);
  }
}

const urls = await getUrlsFromSitemap();
await submitToIndexNow(urls);
