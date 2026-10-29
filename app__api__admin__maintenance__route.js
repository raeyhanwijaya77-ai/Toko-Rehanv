import { sql, init } from '@/lib/db';
import { getUser, isAdmin } from '@/lib/auth';
import { getMaint, validTime, wibClock } from '@/lib/maint';
const no = () => Response.json({ error: 'forbidden' }, { status: 403 });
const bad = (m) => Response.json({ error: m }, { status: 400 });
const put = (k, v) => sql`insert into meta(k,v) values(${k},${String(v)}) on conflict(k) do update set v=excluded.v`;
export async function GET() {
  if (!isAdmin(await getUser())) return no();
  await init();
  const m = await getMaint(true);
  return Response.json({ ...m, now: wibClock() });
}
export async function POST(req) {
  if (!isAdmin(await getUser())) return no();
  await init();
  const { mode, start, end, msg } = await req.json();
  if (mode !== undefined) {
    if (!['auto', 'on', 'off'].includes(mode)) return bad('Mode tidak valid');
    await put('maint_mode', mode);
  }
  if (start !== undefined) { if (!validTime(start)) return bad('Jam mulai tidak valid'); await put('maint_start', start); }
  if (end !== undefined) { if (!validTime(end)) return bad('Jam selesai tidak valid'); await put('maint_end', end); }
  if (msg !== undefined) await put('maint_msg', String(msg).trim().slice(0, 300));
  const m = await getMaint(true);
  return Response.json({ ok: 1, ...m, now: wibClock() });
}
