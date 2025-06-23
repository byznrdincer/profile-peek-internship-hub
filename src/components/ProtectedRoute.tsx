
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'student' | 'recruiter';
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute: Auth state changed', { isAuthenticated, profile, loading, requireRole });
    
    if (!loading) {
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to /auth');
        navigate('/auth');
        return;
      }
      
      if (requireRole && profile?.role !== requireRole) {
        console.log('Wrong role, redirecting to /', { currentRole: profile?.role, requiredRole: requireRole });
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, profile, loading, requireRole, navigate]);

  if (loading) {
    console.log('ProtectedRoute: Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, showing null');
    return null;
  }

  if (requireRole && profile?.role !== requireRole) {
    console.log('ProtectedRoute: Wrong role, showing null');
    return null;
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
