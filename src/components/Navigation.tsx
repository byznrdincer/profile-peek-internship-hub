import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, Home, User, Users, LogOut, Menu, Settings, Info, HelpCircle, GraduationCap, Building } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileForm from "@/components/recruiter/ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, signOut, user } = useAuth();
  const { toast } = useToast();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company_name: "",
    position: "",
    location: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isProfileDialogOpen && user && profile?.role === 'recruiter') {
      loadRecruiterProfile();
    }
  }, [isProfileDialogOpen, user, profile]);

  const loadRecruiterProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const { data: recruiterProfile, error } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      if (recruiterProfile) {
        setFormData({
          name: recruiterProfile.name || "",
          phone: recruiterProfile.phone || "",
          company_name: recruiterProfile.company_name || "",
          position: recruiterProfile.position || "",
          location: recruiterProfile.location || "",
        });
      }
    } catch (error) {
      console.error('Error loading recruiter profile:', error);
      toast({
        title: "Error loading profile",
        description: "There was an error loading your profile data.",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleProfileUpdate = (data: any) => {
    setFormData(data);
    setIsProfileDialogOpen(false);
    toast({
      title: "Profile updated successfully!",
      description: "Your recruiter profile has been saved.",
    });
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
                  <div className="w-[300px] p-4">
                    <div className="grid gap-4">
                      <div className="grid gap-1">
                        <h4 className="font-medium leading-none">Navigation</h4>
                        <p className="text-sm text-muted-foreground">
                          Quick access to all features and information
                        </p>
                      </div>
                      
                      {/* Main Pages Section */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Main Pages</h5>
                        <Button
                          variant={location.pathname === '/' ? "default" : "ghost"}
                          onClick={() => navigate('/')}
                          className="justify-start gap-2 h-auto p-2 w-full"
                        >
                          <Home className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">Home</div>
                            <div className="text-xs text-muted-foreground">Back to homepage</div>
                          </div>
                        </Button>

                        <Button
                          variant={location.pathname === '/about' ? "default" : "ghost"}
                          onClick={() => navigate('/about')}
                          className="justify-start gap-2 h-auto p-2 w-full"
                        >
                          <Info className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">About Us</div>
                            <div className="text-xs text-muted-foreground">Our mission and story</div>
                          </div>
                        </Button>

                        <Button
                          variant={location.pathname === '/how-it-works' ? "default" : "ghost"}
                          onClick={() => navigate('/how-it-works')}
                          className="justify-start gap-2 h-auto p-2 w-full"
                        >
                          <HelpCircle className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">How It Works</div>
                            <div className="text-xs text-muted-foreground">Step-by-step guide</div>
                          </div>
                        </Button>
                      </div>

                      {/* Target Audience Section */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">For You</h5>
                        <Button
                          variant={location.pathname === '/for-students' ? "default" : "ghost"}
                          onClick={() => navigate('/for-students')}
                          className="justify-start gap-2 h-auto p-2 w-full"
                        >
                          <GraduationCap className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">For Students</div>
                            <div className="text-xs text-muted-foreground">Showcase your projects</div>
                          </div>
                        </Button>

                        <Button
                          variant={location.pathname === '/for-companies' ? "default" : "ghost"}
                          onClick={() => navigate('/for-companies')}
                          className="justify-start gap-2 h-auto p-2 w-full"
                        >
                          <Building className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">For Companies</div>
                            <div className="text-xs text-muted-foreground">Find skilled engineers</div>
                          </div>
                        </Button>
                      </div>

                      {/* User-specific sections */}
                      {isAuthenticated && (
                        <>
                          <div className="border-t pt-3">
                            <h5 className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-2">Your Dashboard</h5>
                            <div className="space-y-2">
                              {profile?.role === 'student' && (
                                <Button
                                  variant={location.pathname === '/student-dashboard' ? "default" : "ghost"}
                                  onClick={() => navigate('/student-dashboard')}
                                  className="justify-start gap-2 h-auto p-2 w-full"
                                >
                                  <User className="h-4 w-4" />
                                  <div className="text-left">
                                    <div className="font-medium">Student Dashboard</div>
                                    <div className="text-xs text-muted-foreground">Manage your profile</div>
                                  </div>
                                </Button>
                              )}
                              
                              {profile?.role === 'recruiter' && (
                                <>
                                  <Button
                                    variant={location.pathname === '/recruiter-dashboard' ? "default" : "ghost"}
                                    onClick={() => navigate('/recruiter-dashboard')}
                                    className="justify-start gap-2 h-auto p-2 w-full"
                                  >
                                    <Users className="h-4 w-4" />
                                    <div className="text-left">
                                      <div className="font-medium">Recruiter Dashboard</div>
                                      <div className="text-xs text-muted-foreground">Find talented students</div>
                                    </div>
                                  </Button>
                                  
                                  <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="justify-start gap-2 h-auto p-2 w-full"
                                      >
                                        <Settings className="h-4 w-4" />
                                        <div className="text-left">
                                          <div className="font-medium">My Profile</div>
                                          <div className="text-xs text-muted-foreground">Update recruiter profile</div>
                                        </div>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Recruiter Profile</DialogTitle>
                                      </DialogHeader>
                                      <ProfileForm
                                        initialData={formData}
                                        onUpdate={handleProfileUpdate}
                                        loading={profileLoading}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
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
                      
                      <div className="border-t pt-3">
                        <Button
                          variant="ghost"
                          onClick={() => navigate('/terms')}
                          className="justify-start gap-2 h-auto p-2 w-full"
                        >
                          <Settings className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">Terms & Conditions</div>
                            <div className="text-xs text-muted-foreground">Legal information</div>
                          </div>
                        </Button>
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
