
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { LoginForm } from '@/components/auth/LoginForm';

export default function Dashboard() {
  const { isAuthenticated, user, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-login with admin user for testing purposes
    if (!isAuthenticated) {
      login('admin', 'password', 'admin').then(() => {
        navigate('/admin/dashboard');
      });
      return;
    }

    if (isAuthenticated && user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'governor':
          navigate('/governor/dashboard');
          break;
        case 'secretary_general':
          navigate('/secretary-general/dashboard');
          break;
        case 'personal_secretary':
          navigate('/personal-secretary/dashboard');
          break;
        case 'division_head':
          navigate('/division-head/dashboard');
          break;
        default:
          navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, user, navigate, login]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-institutional-blue mx-auto mb-4"></div>
        <p className="text-muted-foreground">Initialisation en cours...</p>
      </div>
    </div>
  );
}
