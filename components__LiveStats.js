'use client';
import { useState, useEffect } from 'react';

export default function LiveStats() {
  const [stats, setStats] = useState({
    visitMember: 1420,
    onMember: 94,
    accountsSold: 382,
    totalStock: 48
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onMember: Math.max(15, prev.onMember + (Math.random() > 0.5 ? 1 : -1)),
        visitMember: prev.visitMember + 1
      }));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="my-8 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#39ff88] animate-ping" />
          LIVE STATS REALTIME (UPDATE HARIAN)
        </h2>
        <span className="text-[10px] text-slate-400">🔄 Auto Sync</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="cyborg-card p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-lg">
            👁️
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Visit Member</p>
            <p className="text-lg font-black text-white">{stats.visitMember.toLocaleString()}</p>
          </div>
        </div>

        <div className="cyborg-card p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#39ff88]/10 text-[#39ff88] border border-[#39ff88]/30 text-lg">
            👥
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">On Member (Online)</p>
            <p className="text-lg font-black text-[#39ff88]">{stats.onMember}</p>
          </div>
        </div>

        <div className="cyborg-card p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#b000ff]/10 text-[#b000ff] border border-[#b000ff]/30 text-lg">
            ✅
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Akun Terjual/Terlelang</p>
            <p className="text-lg font-black text-[#b000ff]">{stats.accountsSold}</p>
          </div>
        </div>

        <div className="cyborg-card p-3.5 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/30 text-lg">
            📦
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Stok Akun</p>
            <p className="text-lg font-black text-[#ff007f]">{stats.totalStock}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
