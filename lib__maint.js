import { sql } from '@/lib/db';

export const MAINT_DEFAULT = { mode: 'auto', start: '23:00', end: '01:00', msg: 'Toko sedang maintenance rutin. Kami segera kembali, terima kasih sudah menunggu.' };
const toMin = (s) => { const [h, m] = String(s).split(':').map(Number); return (h || 0) * 60 + (m || 0); };
export const validTime = (s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(s));

// Menit sejak 00:00 WIB (UTC+7), tidak tergantung zona waktu server
export const wibMinutes = (d = new Date()) => (d.getUTCHours() * 60 + d.getUTCMinutes() + 420) % 1440;
export const wibClock = (d = new Date()) => { const m = wibMinutes(d); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

// Jendela jadwal, aman untuk yang melewati tengah malam (23:00 sampai 01:00)
export function inWindow(now, start, end) {
  const a = toMin(start), b = toMin(end);
  if (a === b) return false;
  return a < b ? now >= a && now < b : now >= a || now < b;
}

let cache = { t: 0, v: null };
export async function getMaint(fresh = false) {
  if (!fresh && cache.v && Date.now() - cache.t < 10000) return cache.v;
  let c = { ...MAINT_DEFAULT };
  try {
    const r = await sql`select k,v from meta where k in ('maint_mode','maint_start','maint_end','maint_msg')`;
    const m = Object.fromEntries(r.map((x) => [x.k, x.v]));
    if (['auto', 'on', 'off'].includes(m.maint_mode)) c.mode = m.maint_mode;
    if (validTime(m.maint_start)) c.start = m.maint_start;
    if (validTime(m.maint_end)) c.end = m.maint_end;
    if (m.maint_msg && m.maint_msg.trim()) c.msg = m.maint_msg;
  } catch {}
  const sched = inWindow(wibMinutes(), c.start, c.end);
  const on = c.mode === 'on' || (c.mode === 'auto' && sched);
  const v = { ...c, on, by: !on ? '' : c.mode === 'on' ? 'manual' : 'jadwal' };
  cache = { t: Date.now(), v };
  return v;
}
