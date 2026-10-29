import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getMaint } from '@/lib/maint';

const ADMIN = (process.env.ADMIN_EMAIL || 'raeyhanwijaya77@gmail.com').toLowerCase().trim();
// Tetap bisa dibuka saat maintenance: login admin, panel admin, webhook pembayaran, statistik
const OPEN = ['/admin', '/login', '/maintenance', '/api/admin', '/api/auth', '/api/logout', '/api/webhook', '/api/live', '/api/track'];
const open = (p) => OPEN.some((x) => p === x || p.startsWith(x + '/'));

async function secretKey() {
  if (process.env.JWT_SECRET) return new TextEncoder().encode(process.env.JWT_SECRET);
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('k1' + (process.env.DATABASE_URL || 'dev')));
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return new TextEncoder().encode(hex);
}
async function isOwner(req) {
  try {
    const t = req.cookies.get('s')?.value;
    if (!t) return false;
    const { payload } = await jwtVerify(t, await secretKey());
    return payload.role === 'admin_rehan' || String(payload.email || '').toLowerCase() === ADMIN;
  } catch { return false; }
}

export async function middleware(req) {
  const p = req.nextUrl.pathname;
  if (open(p)) return NextResponse.next();
  const m = await getMaint();
  if (!m.on) return NextResponse.next();
  if (await isOwner(req)) return NextResponse.next(); // owner bebas menjelajah untuk tes
  const h = { 'Retry-After': '900', 'Cache-Control': 'no-store' };
  if (p.startsWith('/api/')) {
    // Hanya tutup aksi yang mengubah data. Cek status pesanan yang sudah ada tetap jalan.
    if (req.method === 'GET' || req.method === 'HEAD') return NextResponse.next();
    return Response.json({ error: 'Toko sedang maintenance. Coba lagi nanti.', maintenance: true }, { status: 503, headers: h });
  }
  const res = NextResponse.rewrite(new URL('/maintenance', req.url), { status: 503 });
  Object.entries(h).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'] };
