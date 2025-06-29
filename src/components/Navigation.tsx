import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, profile, signOut } = useAuth();

  const handleDashboardNavigation = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (profile?.role === 'student') {
      navigate('/student-dashboard');
    } else if (profile?.role === 'recruiter') {
      navigate('/recruiter-dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: "How it Works", href: "/how-it-works" },
    { label: "For Students", href: "/for-students" },
    { label: "For Companies", href: "/for-companies" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              lazyIntern
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleDashboardNavigation}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleDashboardNavigation();
                            setIsOpen(false);
                          }}
                          className="w-full"
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="w-full"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => {
                          navigate('/auth');
                          setIsOpen(false);
                        }}
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
