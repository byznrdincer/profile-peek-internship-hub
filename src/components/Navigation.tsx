
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Menu, Briefcase, Home, Info, Users, Building2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    { label: "Home", href: "/", icon: Home },
    { label: "How it Works", href: "/how-it-works", icon: Info },
    { label: "For Students", href: "/for-students", icon: Users },
    { label: "For Companies", href: "/for-companies", icon: Building2 },
    { label: "About", href: "/about", icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 border-r bg-white">
          <SidebarContent>
            {/* Logo Section */}
            <div className="p-6 border-b">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-blue-600">lazy</span>
                  <span className="text-teal-600">Intern</span>
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Auth Section */}
            <div className="mt-auto p-4 border-t">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={handleDashboardNavigation}
                    className="w-full justify-start"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  Get Started
                </Button>
              )}
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white shadow-md">
              <Menu className="h-6 w-6" />
            </Button>
          </SidebarTrigger>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Navigation;
