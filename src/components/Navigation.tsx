
import { Button } from "@/components/ui/button";
import { Briefcase, Home, User, Users, LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
        <div className="flex items-center space-x-4">
          {/* Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="grid gap-3">
                      <div className="grid gap-1">
                        <h4 className="font-medium leading-none">Navigation</h4>
                        <p className="text-sm text-muted-foreground">
                          Quick access to all features
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Button
                          variant={location.pathname === '/' ? "default" : "ghost"}
                          onClick={() => navigate('/')}
                          className="justify-start gap-2 h-auto p-2"
                        >
                          <Home className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">Home</div>
                            <div className="text-xs text-muted-foreground">Back to homepage</div>
                          </div>
                        </Button>
                        
                        {isAuthenticated && (
                          <>
                            {profile?.role === 'student' && (
                              <Button
                                variant={location.pathname === '/student-dashboard' ? "default" : "ghost"}
                                onClick={() => navigate('/student-dashboard')}
                                className="justify-start gap-2 h-auto p-2"
                              >
                                <User className="h-4 w-4" />
                                <div className="text-left">
                                  <div className="font-medium">Student Dashboard</div>
                                  <div className="text-xs text-muted-foreground">Manage your profile</div>
                                </div>
                              </Button>
                            )}
                            
                            {profile?.role === 'recruiter' && (
                              <Button
                                variant={location.pathname === '/recruiter-dashboard' ? "default" : "ghost"}
                                onClick={() => navigate('/recruiter-dashboard')}
                                className="justify-start gap-2 h-auto p-2"
                              >
                                <Users className="h-4 w-4" />
                                <div className="text-left">
                                  <div className="font-medium">Recruiter Dashboard</div>
                                  <div className="text-xs text-muted-foreground">Find talented students</div>
                                </div>
                              </Button>
                            )}
                            
                            <div className="border-t pt-2">
                              <Button
                                variant="ghost"
                                onClick={handleSignOut}
                                className="justify-start gap-2 h-auto p-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <LogOut className="h-4 w-4" />
                                <div className="text-left">
                                  <div className="font-medium">Sign Out</div>
                                  <div className="text-xs text-muted-foreground">Logout from your account</div>
                                </div>
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              InternStack
            </h1>
          </div>
        </div>
        
        <nav className="flex items-center space-x-4">
          {!isAuthenticated && (
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
