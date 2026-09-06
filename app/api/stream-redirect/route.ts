import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import logger from '@/lib/logger';

const SECRET_KEY = process.env.STREAM_SECRET || 'default_stream_hmac_secret_key_123_abc';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const u = searchParams.get('u');
  const expires = searchParams.get('expires');
  const sig = searchParams.get('sig');

  if (!u || !expires || !sig) {
    logger.warn('Unauthorized access attempt: Missing credentials', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      url: request.url
    });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const expiresTimestamp = parseInt(expires, 10);
  if (isNaN(expiresTimestamp) || expiresTimestamp < Date.now()) {
    logger.warn('Forbidden access attempt: Stream link expired', {
      u,
      expires,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    return NextResponse.json({ error: 'Stream link has expired' }, { status: 403 });
  }

  const expectedSig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${u}:${expires}`)
    .digest('hex');

  if (sig !== expectedSig) {
    logger.warn('Forbidden access attempt: Signature mismatch', {
      u,
      expires,
      sig,
      expectedSig,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  try {
    const decoded = Buffer.from(u, 'base64url').toString('utf-8');
    if (!decoded.startsWith('http://') && !decoded.startsWith('https://')) {
      logger.warn('Invalid redirect URL decoded', { decoded });
      return NextResponse.json({ error: 'Invalid URL scheme' }, { status: 400 });
    }
    return NextResponse.redirect(decoded, 302);
  } catch (err: any) {
    logger.error('Failed decoding redirect URL', err, { u });
    return NextResponse.json({ error: 'Invalid encoding' }, { status: 400 });
  }
}
