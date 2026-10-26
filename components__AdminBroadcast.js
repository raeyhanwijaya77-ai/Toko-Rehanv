'use client';
import { useState } from 'react';

export default function AdminBroadcast() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resMsg, setResMsg] = useState({ error: '', success: '' });

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResMsg({ error: '', success: '' });

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();

      if (res.ok) {
        setResMsg({ error: '', success: data.message });
        setSubject('');
        setMessage('');
      } else {
        setResMsg({ error: data.error || 'Gagal mengirim broadcast', success: '' });
      }
    } catch {
      setResMsg({ error: 'Terjadi kesalahan koneksi', success: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyborg-card p-6 space-y-4 max-w-2xl">
      <h2 className="text-lg font-bold text-[#00f0ff] flex items-center gap-2">
        📢 BROADCAST PROMO MASSAL (EMAIL PELANGGAN)
      </h2>

      {resMsg.error && (
        <div className="p-3 bg-[#ff007f]/20 border border-[#ff007f] text-[#ff007f] text-xs font-bold rounded-lg">
          ⚠️ {resMsg.error}
        </div>
      )}

      {resMsg.success && (
        <div className="p-3 bg-[#39ff88]/20 border border-[#39ff88] text-[#39ff88] text-xs font-bold rounded-lg">
          ✓ {resMsg.success}
        </div>
      )}

      <form onSubmit={handleSendBroadcast} className="space-y-4">
        <div>
          <label className="text-xs text-slate-300 block mb-1">Judul / Subjek Email</label>
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Contoh: Stok Akun Blox Fruit Restock & Flash Sale!"
            className="w-full bg-[#04080f] border border-[#00f0ff]/30 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-300 block mb-1">Isi Pesan Promo</label>
          <textarea 
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan detail promo, diskon, atau info stok terbaru di sini..."
            className="w-full bg-[#04080f] border border-[#00f0ff]/30 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="cyborg-btn-cyan text-xs w-full py-3 font-bold"
        >
          {loading ? 'MENGIRIM EMAIL...' : '🚀 KIRIM BROADCAST KE SEMUA PELANGGAN'}
        </button>
      </form>
    </div>
  );
}
