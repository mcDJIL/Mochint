import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Login from '../auth/Login';
import Register from '../auth/Regist';

const MemberApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State untuk kontrol modal
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Cek apakah sudah login
  useEffect(() => {
    const activeUser = localStorage.getItem('active_user');
    const adminToken = localStorage.getItem('token');
    
    if (activeUser) {
      navigate('/member');
      return;
    } else if (adminToken) {
      navigate('/admin/dashboard');
      return;
    }
  }, [navigate]);

  // Menangkap perintah buka modal dari Home (handleBookingClick)
  useEffect(() => {
    if (location.state?.openLogin) {
      setShowLogin(true);
    }
    if (location.state?.openRegister) {
      setShowRegister(true);
    }
  }, [location]);

  // --- LOGIKA PERPINDAHAN MODAL ---
  const openRegister = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowRegister(true);
  };

  const openLogin = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  const openForgot = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
  };

  // Jika showLogin true, tampilkan halaman login penuh
  if (showLogin) {
    return <Login onSwitch={openRegister} onForgot={openForgot} onBack={() => setShowLogin(false)} />;
  }

  // Jika showRegister true, tampilkan halaman register penuh
  if (showRegister) {
    return <Register onSwitch={openLogin} onBack={() => setShowRegister(false)} />;
  }

  // Jika showForgotPassword true, tampilkan halaman forgot password
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
          <button 
            onClick={() => setShowForgotPassword(false)} 
            className="flex items-center text-[#8D6E63] hover:text-[#3E2723] font-bold mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Kembali ke Login
          </button>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#FDFBF7] text-[#8D6E63] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Mail size={32} />
            </div>
            <h3 className="text-3xl font-display font-bold text-[#3E2723] tracking-tight">Reset Password</h3>
            <p className="text-sm font-sans font-medium text-[#8D6E63] mt-3 leading-relaxed opacity-80">
              Masukkan email Anda untuk menerima instruksi pemulihan kata sandi.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <form className="space-y-6">
              <div className="text-left">
                <label className="block text-[10px] font-black text-[#A1887F] mb-2 uppercase tracking-widest font-sans">Registered Email</label>
                <input 
                  type="email" 
                  placeholder="username@gmail.com" 
                  className="w-full px-6 py-4 rounded-2xl bg-[#FDFBF7] border-2 border-transparent focus:bg-white focus:border-[#8D6E63] outline-none transition-all font-sans font-medium text-sm"
                  required
                />
              </div>
              <button 
                type="button"
                onClick={() => {
                  alert("Link reset password telah dikirim ke email Anda!");
                  setShowForgotPassword(false);
                  setShowLogin(true);
                }}
                className="w-full py-5 bg-[#3E2723] text-white font-display font-bold rounded-2xl shadow-xl hover:bg-[#8D6E63] transition-all uppercase tracking-widest text-xs"
              >
                Send Instructions
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Landing page default
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center font-sans">
      
      {/* Konten Utama Page 1 - Poppins */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-7xl font-display font-bold text-[#3E2723] leading-tight tracking-tighter">
          Welcome to <br /> 
          <span className="text-[#8D6E63]">Mochint Beauty Care</span>
        </h1>
        <p className="text-[#8D6E63] font-sans font-medium max-w-md mx-auto leading-relaxed opacity-80">
          Silakan masuk untuk mengakses profil eksklusif, riwayat perawatan, dan layanan prioritas kami.
        </p>
      </div>

      {/* Tombol Login - Poppins */}
      <button 
        onClick={() => setShowLogin(true)}
        className="px-16 py-5 bg-[#3E2723] text-white font-display font-bold text-sm uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-[#3E2723]/30 hover:bg-[#8D6E63] transition-all duration-500 w-full max-w-xs mb-8 transform active:scale-95"
      >
        Masuk
      </button>

      {/* Link Daftar - Inter */}
      <p className="text-[13px] text-gray-400 font-medium">
        Belum memiliki akun member?{' '}
        <button onClick={openRegister} className="text-[#8D6E63] font-bold hover:text-[#3E2723] transition-colors border-b border-[#8D6E63]/20">
          Daftar sekarang
        </button>
      </p>

    </div>
  );
};

export default MemberApp;