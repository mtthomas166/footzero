import { NextResponse } from 'next/server';

const KEY = process.env.INDEXNOW_KEY || '3287ea2024794c178fda50a2cf16d02e';
const HOST = 'footzero-es32.vercel.app';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const sitemapUrl = `https://${HOST}/sitemap.xml`;
    const res = await fetch(sitemapUrl, { cache: 'no-store' });
    const xml = await res.text();
    const urlList = [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim()))].slice(0, 10000);

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList
    };

    const submitRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await submitRes.text();
    
    return NextResponse.json({
      success: submitRes.ok,
      status: submitRes.status,
      submitted: urlList.length,
      result,
      keyLocation: KEY_LOCATION
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
