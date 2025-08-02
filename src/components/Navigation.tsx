import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Menu, User, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProfileForm from "@/components/recruiter/ProfileForm";
import LILogo from "@/components/ui/LILogo";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, profile, user, signOut } = useAuth();

  useEffect(() => {
    if (profile?.role === 'recruiter' && user) {
      loadRecruiterProfile();
    }
  }, [profile, user]);

  const loadRecruiterProfile = async () => {
    if (!user) {
      console.log('Navigation: No user found');
      return;
    }

    setLoading(true);
    try {
      console.log('Navigation: Loading recruiter profile for user ID:', user.id);

      const res = await fetch(`/api/recruiter/profile/${user.id}`);
      if (!res.ok) throw new Error('Failed to load recruiter profile');

      const recruiterData = await res.json();

      if (Object.keys(recruiterData).length === 0) {
        console.log('Navigation: No recruiter profile found');
        setRecruiterProfile(null);
      } else {
        console.log('Navigation: Successfully loaded recruiter profile:', recruiterData);
        setRecruiterProfile(recruiterData);
      }
    } catch (error) {
      console.error('Navigation: Error loading recruiter profile:', error);
      setRecruiterProfile(null);
    } finally {
      setLoading(false);
    }
  };

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

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log('Navigation: Profile updated:', updatedProfile);
    setRecruiterProfile({
      ...recruiterProfile,
      ...updatedProfile
    });
    setIsEditProfileOpen(false);
    setIsProfileOpen(false);
    setTimeout(() => {
      loadRecruiterProfile();
    }, 100);
  };

  const handleProfileDialogOpen = () => {
    console.log('Navigation: Opening profile dialog, reloading data...');
    loadRecruiterProfile();
    setIsProfileOpen(true);
  };

  const getNavItems = () => {
    if (isAuthenticated && profile?.role === 'recruiter') {
      return [];
    } else if (isAuthenticated && profile?.role === 'student') {
      return [];
    } else {
      return [
        { label: "How it Works", href: "/how-it-works" },
        { label: "For Students", href: "/for-students" },
        { label: "For Companies", href: "/for-companies" },
        { label: "About", href: "/about" },
      ];
    }
  };

  const navItems = getNavItems();

  const ProfileDialog = () => (
    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Profile
          </DialogTitle>
          <DialogDescription>
            View and manage your profile information
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-4 text-center">Loading...</div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-sm text-gray-900">{recruiterProfile?.name || 'Not provided'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company</label>
              <p className="text-sm text-gray-900">{recruiterProfile?.company_name || 'Not provided'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Position</label>
              <p className="text-sm text-gray-900">{recruiterProfile?.position || 'Not provided'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <p className="text-sm text-gray-900">{recruiterProfile?.location || 'Not provided'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-sm text-gray-900">{recruiterProfile?.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{profile?.email || 'Not provided'}</p>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsEditProfileOpen(true);
                }}
                className="w-full flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const EditProfileDialog = () => (
    <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ProfileForm
            initialData={{
              name: recruiterProfile?.name || "",
              phone: recruiterProfile?.phone || "",
              company_name: recruiterProfile?.company_name || "",
              position: recruiterProfile?.position || "",
              location: recruiterProfile?.location || ""
            }}
            onUpdate={handleProfileUpdate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <LILogo />
            <span className="text-xl font-bold">
              <span className="text-blue-600 font-fredoka">lazy</span>
              <span className="text-teal-600">Intern</span>
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
                {profile?.role === 'recruiter' && (
                  <Button
                    variant="outline"
                    onClick={handleProfileDialogOpen}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleDashboardNavigation}
                  className="flex items-center gap-2"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
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
                        {profile?.role === 'recruiter' && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleProfileDialogOpen();
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 justify-start"
                          >
                            <User className="h-4 w-4" />
                            My Profile
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleDashboardNavigation();
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center gap-2 justify-start"
                        >
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center gap-2 justify-start"
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

      <ProfileDialog />
      <EditProfileDialog />
    </nav>
  );
};

export default Navigation;
