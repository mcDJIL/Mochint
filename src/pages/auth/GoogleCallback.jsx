import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        
        console.log('✅ Google login success, redirecting to email verification');
        console.log('Token:', token);
        console.log('User:', user);
        
        // Redirect to email verification page first
        // User needs to verify email and set password before accessing dashboard
        navigate('/auth/verify-email', {
          state: { user, token },
          replace: true
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/auth/login?error=invalid_callback');
      }
    } else {
      navigate('/auth/login?error=missing_data');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#3E2723] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#3E2723] font-medium">Memproses login dengan Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
