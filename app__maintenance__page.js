import Robot from '@/components/Robot';
import { getMaint } from '@/lib/maint';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Maintenance — Toko Akun Rehan' };
export default async function Maintenance() {
  const m = await getMaint(true);
  return (
    <div className="w" style={{ textAlign: 'center', padding: '60px 0' }}>
      <Robot size={140} />
      <h1 style={{ fontSize: 30, margin: '14px 0 8px' }}>{m.on ? 'Sedang Maintenance' : 'Toko sedang buka'}</h1>
      {m.on ? (
        <>
          <p className="mut" style={{ marginBottom: 10, maxWidth: 460, margin: '0 auto 10px', whiteSpace: 'pre-line' }}>{m.msg}</p>
          {m.by === 'jadwal' && <p className="mut" style={{ marginBottom: 18 }}>Perkiraan selesai pukul <b>{m.end} WIB</b></p>}
        </>
      ) : <p className="mut" style={{ marginBottom: 18 }}>Maintenance sudah selesai, silakan belanja lagi.</p>}
      <a href="/" className="btn">{m.on ? 'Coba muat ulang' : 'Ke toko'}</a>
    </div>
  );
}
