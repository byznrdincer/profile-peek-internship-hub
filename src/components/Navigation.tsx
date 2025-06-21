
import { Button } from "@/components/ui/button";
import { Briefcase, Home, User, Users, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            InternStack
          </h1>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Button
            variant={location.pathname === '/' ? "default" : "ghost"}
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          
          {isAuthenticated ? (
            <>
              {profile?.role === 'student' && (
                <Button
                  variant={location.pathname === '/student-dashboard' ? "default" : "ghost"}
                  onClick={() => navigate('/student-dashboard')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  MyDashboard
                </Button>
              )}
              
              {profile?.role === 'recruiter' && (
                <Button
                  variant={location.pathname === '/recruiter-dashboard' ? "default" : "ghost"}
                  onClick={() => navigate('/recruiter-dashboard')}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  MyDashboard
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
