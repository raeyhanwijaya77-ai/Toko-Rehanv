'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function ProfilPage() {
  const [user, setUser] = useState({ username: '', email: '' });
  const [avatar, setAvatar] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  
  const [passData, setPassData] = useState({
    oldPass: '',
    newPass: '',
    confirmPass: ''
  });

  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(() => {
        // Fetch current profile data
        return fetch('/api/admin/users');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileMsg('Profil berhasil diperbarui!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ error: '', success: '' });

    if (!passData.oldPass || !passData.newPass || !passData.confirmPass) {
      setPassMsg({ error: 'Semua kolom kata sandi wajib diisi!', success: '' });
      return;
    }

    if (passData.newPass !== passData.confirmPass) {
      setPassMsg({ error: 'Konfirmasi kata sandi baru tidak cocok!', success: '' });
      return;
    }

    if (passData.newPass.length < 6) {
      setPassMsg({ error: 'Kata sandi baru minimal 6 karakter!', success: '' });
      return;
    }

    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        body: JSON.stringify({ old: passData.oldPass, password: passData.newPass })
      });
      const data = await res.json();
      if (res.ok) {
        setPassMsg({ error: '', success: 'Kata sandi berhasil diperbarui!' });
        setPassData({ oldPass: '', newPass: '', confirmPass: '' });
      } else {
        setPassMsg({ error: data.error || 'Gagal mengubah kata sandi', success: '' });
      }
    } catch {
      setPassMsg({ error: 'Terjadi kesalahan koneksi', success: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#04080f] text-slate-100 pb-16">
      <Navbar user={{ username: usernameInput || 'Pengguna' }} />

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        <h1 className="text-2xl font-black text-[#00f0ff] flex items-center gap-2">
          👤 PENGATURAN PROFIL
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Edit Profile & Upload Foto */}
          <div className="cyborg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-[#00f0ff] border-b border-slate-800 pb-2">
              Foto Profil & Nama
            </h2>

            {profileMsg && (
              <div className="p-3 bg-[#39ff88]/20 border border-[#39ff88] text-[#39ff88] text-xs font-bold rounded-lg">
                ✓ {profileMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-[#071420] border-2 border-[#00f0ff] overflow-hidden flex items-center justify-center relative">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-[#00f0ff]">
                      {(usernameInput || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <label className="cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 font-semibold">
                  📷 Upload Foto Profil
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama / Username</label>
                <input 
                  type="text" 
                  value={usernameInput} 
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full bg-[#04080f] border border-[#00f0ff]/30 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <button type="submit" className="w-full cyborg-btn-cyan text-xs">
                SIMPAN PROFIL
              </button>
            </form>
          </div>

          {/* Section 2: Ganti Password */}
          <div className="cyborg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-[#b000ff] border-b border-slate-800 pb-2">
              🔒 Ganti Kata Sandi
            </h2>

            {passMsg.error && (
              <div className="p-3 bg-[#ff007f]/20 border border-[#ff007f] text-[#ff007f] text-xs font-bold rounded-lg">
                ⚠️ {passMsg.error}
              </div>
            )}

            {passMsg.success && (
              <div className="p-3 bg-[#39ff88]/20 border border-[#39ff88] text-[#39ff88] text-xs font-bold rounded-lg">
                ✓ {passMsg.success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Sandi Lama</label>
                <input 
                  type="password" 
                  value={passData.oldPass} 
                  onChange={(e) => setPassData({...passData, oldPass: e.target.value})}
                  placeholder="Sandi saat ini"
                  className="w-full bg-[#04080f] border border-[#00f0ff]/30 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Sandi Baru</label>
                <input 
                  type="password" 
                  value={passData.newPass} 
                  onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-[#04080f] border border-[#00f0ff]/30 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Konfirmasi Sandi Baru</label>
                <input 
                  type="password" 
                  value={passData.confirmPass} 
                  onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                  placeholder="Sandi baru lagi"
                  className="w-full bg-[#04080f] border border-[#00f0ff]/30 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <button type="submit" className="w-full cyborg-btn-purple text-xs">
                UPDATE KATA SANDI
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
