import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const ForgotPassword = ({ onBack }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Email tidak boleh kosong'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Format email tidak valid'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if email exists in database first (optional - you can skip this)
      // For now, we'll proceed directly to send OTP
      
      // Navigate to email verification page with forgot password context
      navigate('/auth/verify-email', {
        state: { 
          user: { email: email },
          isForgotPassword: true
        },
        replace: true
      });
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        {/* Tombol Kembali */}
        {onBack ? (
          <button 
            onClick={onBack}
            className="group flex items-center text-[#8D6E63] hover:text-[#3E2723] text-sm font-semibold mb-8 transition-all"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Login
          </button>
        ) : (
          <button 
            onClick={() => navigate('/auth/login')}
            className="group flex items-center text-[#8D6E63] hover:text-[#3E2723] text-sm font-semibold mb-8 transition-all"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Login
          </button>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-brown-100/20 overflow-hidden">
          <div className="p-8 md:p-10">
            
            {/* Header Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8D6E63] rounded-2xl mb-4">
                <Mail size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#3E2723]">Lupa Password?</h3>
              <p className="text-[#A1887F] text-sm mt-2 text-center">
                Masukkan email Anda dan kami akan mengirimkan kode verifikasi untuk reset password
              </p>
            </div>

            {/* Notification */}
            {notification.show && (
              <div className={`mb-6 p-4 border-l-4 rounded-r-xl text-sm animate-pulse ${
                notification.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}>
                <div className="flex items-center">
                  {notification.type === 'success' ? (
                    <CheckCircle className="mr-2" size={18} />
                  ) : (
                    <AlertCircle className="mr-2" size={18} />
                  )}
                  <span>{notification.message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#A1887F] ml-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] group-focus-within:text-[#3E2723] transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="nama@email.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FDFBF7] border-2 border-transparent focus:border-[#8D6E63] focus:bg-white transition-all outline-none text-[#3E2723] font-medium" 
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 mt-2 font-bold rounded-2xl shadow-lg transition-all transform active:scale-[0.98] text-sm tracking-wide ${
                  isLoading
                    ? 'bg-[#D7CCC8] text-[#8D6E63] cursor-not-allowed' 
                    : 'bg-[#3E2723] text-white hover:bg-[#5D4037] hover:shadow-[#3E2723]/30'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>MEMPROSES...</span>
                  </div>
                ) : "KIRIM KODE VERIFIKASI"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-sm text-[#A1887F] mt-8">
          Sudah ingat password Anda?{' '}
          <button 
            type="button"
            onClick={onBack || (() => navigate('/auth/login'))} 
            className="text-[#3E2723] font-extrabold hover:underline transition-all"
          >
            Login Sekarang
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
