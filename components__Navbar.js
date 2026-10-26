'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Robot from '@/components/Robot';

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({ activeUsers: 88, totalVisitors: 3890 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: Math.max(12, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 2)
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#04080f]/90 backdrop-blur-md border-b border-[#00f0ff]/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Hamburger Button + Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#00f0ff] hover:bg-[#00f0ff]/10 border border-[#00f0ff]/30 focus:outline-none transition-all"
            aria-label="Toggle Navigation Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Robot size={28} />
            <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-white to-[#b000ff] cyborg-glow">
              TOKO REHAN
            </span>
          </Link>
        </div>

        {/* Center: Live Bar */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-300 bg-[#071420] px-4 py-1.5 rounded-full border border-[#00f0ff]/20">
          <span className="flex items-center gap-1.5 text-[#39ff88]">
            <span className="w-2 h-2 rounded-full bg-[#39ff88] animate-ping" />
            User Online: <strong>{stats.activeUsers}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[#00f0ff]">👁️ Pengunjung: <strong>{stats.totalVisitors}</strong></span>
        </div>

        {/* Right: User / Admin Action */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/profil" className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-[#071420] border border-[#00f0ff]/40 hover:border-[#00f0ff]">
              <span className="w-6 h-6 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-bold flex items-center justify-center">
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </span>
              <span className="font-semibold text-slate-200 hidden sm:inline">{user.username || 'Profil'}</span>
            </Link>
          ) : (
            <Link href="/login" className="cyborg-btn-cyan text-xs">
              MASUK
            </Link>
          )}
        </div>
      </div>

      {/* Hamburger Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-black/80 backdrop-blur-md flex flex-col transition-all">
          <div className="p-6 bg-[#071420] border-b border-[#00f0ff]/30 max-w-md w-full mx-auto space-y-3">
            <p className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest mb-2">Navigasi Utama</p>
            
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[#081420] hover:bg-[#00f0ff]/10 text-slate-200 border border-[#00f0ff]/20 font-semibold text-sm">
              🏠 Home (Beranda)
            </Link>

            <Link href="/lelang" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[#081420] hover:bg-[#ff007f]/10 text-slate-200 border border-[#ff007f]/30 font-semibold text-sm">
              🔥 Lelang Akun
            </Link>

            <Link href="/#stok" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[#081420] hover:bg-[#00f0ff]/10 text-slate-200 border border-[#00f0ff]/20 font-semibold text-sm">
              🛒 Store Akun
            </Link>

            <Link href="/testimoni" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[#081420] hover:bg-[#39ff88]/10 text-slate-200 border border-[#39ff88]/30 font-semibold text-sm">
              ⭐ Testimoni Pembeli
            </Link>

            <Link href="/papan-peringkat" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[#081420] hover:bg-[#b000ff]/10 text-slate-200 border border-[#b000ff]/30 font-semibold text-sm">
              👑 Top Rekor Pembelian
            </Link>

            <a href="https://whatsapp.com/channel/0029VbCOpsZ2UPB9asft7t05" target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg bg-[#081420] hover:bg-[#39ff88]/10 text-slate-200 border border-[#39ff88]/30 font-semibold text-sm">
              📢 Saluran Stok WA
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
