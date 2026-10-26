'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ item, type = 'store' }) {
  const [copied, setCopied] = useState(false);

  // Fix photo fallback bug
  const imageSrc = item.cover && String(item.cover).trim() !== '' 
    ? item.cover 
    : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/akun/${item.id}` 
    : `/akun/${item.id}`;

  const copyLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="cyborg-card overflow-hidden group flex flex-col justify-between h-full relative p-0">
      
      {/* Auto Copy Toast Notification */}
      {copied && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-[#00f0ff] text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
          ✓ Link berhasil disalin!
        </div>
      )}

      <div>
        {/* Cover Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#04080f]">
          <img 
            src={imageSrc} 
            alt={item.title || 'Akun Roblox'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071420] via-transparent to-transparent opacity-80" />

          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5">
            {type === 'lelang' ? (
              <span className="px-2 py-0.5 rounded bg-[#ff007f] text-white text-[10px] font-black uppercase">
                🔥 LELANG
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#00f0ff] text-black text-[10px] font-black uppercase">
                🛒 STORE
              </span>
            )}
          </div>

          {/* Chain Icon Copy Button */}
          <button 
            onClick={copyLink}
            title="Salin Link Produk"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] border border-[#00f0ff]/40 backdrop-blur-md transition-all z-10"
          >
            🔗
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-sm text-slate-100 group-hover:text-[#00f0ff] transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-snug">
            {item.description || 'Akun Roblox spesifikasi lengkap, garansi aman dan siap pakai.'}
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">
                {type === 'lelang' ? 'Bid Highest' : 'Harga Pas'}
              </span>
              <span className="text-base font-extrabold text-[#39ff88]">
                Rp {(item.price || 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <Link 
          href={`/akun/${item.id}`}
          className={`w-full py-2.5 rounded-lg text-xs font-bold text-center block transition-all ${
            type === 'lelang' ? 'cyborg-btn-purple' : 'cyborg-btn-cyan'
          }`}
        >
          {type === 'lelang' ? 'IKUT BID LELANG' : 'BELI SEKARANG'}
        </Link>
      </div>

    </div>
  );
}
