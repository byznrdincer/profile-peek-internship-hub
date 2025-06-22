import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Building, Eye, User, MapPin, Calendar, Code, Trophy, Mail, Download, Filter, Activity, Video, Bookmark, BookmarkCheck, X, DollarSign, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import StudentProfile from "@/components/StudentProfile";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import BookmarkButton from "@/components/BookmarkButton";
import { calculateProfileCompletion } from "@/utils/profileUtils";

const RecruiterDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [bookmarkedStudents, setBookmarkedStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [majorFilter, setMajorFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [graduationYearFilter, setGraduationYearFilter] = useState("");
  const [internshipTypeFilter, setInternshipTypeFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalViews: 0,
    newProfiles: 0
  });
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company_name: "",
    position: "",
    location: "",
  });

  const isActiveUser = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastLoginAt) > thirtyDaysAgo;
  };

  const getActivityStatus = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'inactive';
    
    const now = new Date();
    const lastLogin = new Date(lastLoginAt);
    const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) return 'very-active';
    if (daysDiff <= 30) return 'active';
    return 'inactive';
  };

  // Function to handle bookmark changes - this will be passed to BookmarkButton
  const handleBookmarkChange = () => {
    console.log('handleBookmarkChange called - refreshing bookmarks');
    loadBookmarkedStudents();
    loadStats(); // Refresh stats as bookmark count may have changed
  };

  useEffect(() => {
    document.title = "Recruiter Dashboard - TalentHub";
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStudents();
      loadStats();
      loadBookmarkedStudents();
    }
  }, [user]);

  // Filter and sort students based on major filter, skill filter, location filter, and activity
  useEffect(() => {
    const currentStudents = activeTab === "bookmarks" ? bookmarkedStudents : students;
    let filtered = currentStudents;
    
    if (majorFilter) {
      filtered = filtered.filter(student =>
        student.major?.toLowerCase().includes(majorFilter.toLowerCase())
      );
    }
    
    if (skillFilter) {
      filtered = filtered.filter(student =>
        student.skills?.some((skill: string) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(student =>
        student.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        student.preferred_location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (graduationYearFilter) {
      filtered = filtered.filter(student =>
        student.graduation_year?.toString() === graduationYearFilter
      );
    }

    if (internshipTypeFilter) {
      filtered = filtered.filter(student =>
        student.internship_type_preference === internshipTypeFilter
      );
    }
    
    // Sort by activity level, then by profile views
    filtered.sort((a, b) => {
      const aActivity = getActivityStatus(a.last_login_at);
      const bActivity = getActivityStatus(b.last_login_at);
      
      const activityOrder = { 'very-active': 0, 'active': 1, 'inactive': 2 };
      const aOrder = activityOrder[aActivity as keyof typeof activityOrder];
      const bOrder = activityOrder[bActivity as keyof typeof activityOrder];
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      return (b.profile_views || 0) - (a.profile_views || 0);
    });
    
    setFilteredStudents(filtered);
  }, [students, bookmarkedStudents, activeTab, majorFilter, skillFilter, locationFilter, graduationYearFilter, internshipTypeFilter]);

  const loadProfile = async () => {
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('recruiter_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        company_name: profile.company_name || "",
        position: profile.position || "",
        location: profile.location || "",
      });
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const { data: studentsData, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          student_projects (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add user email from profiles table
      const studentsWithEmail = await Promise.all(
        studentsData.map(async (student) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('user_id', student.user_id)
            .single();
          
          return {
            ...student,
            email: profile?.email || '',
            projects: student.student_projects || []
          };
        })
      );

      setStudents(studentsWithEmail);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error loading students",
        description: "There was an error loading student profiles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get total students count
      const { count: totalStudents } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total profile views for this recruiter
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      let totalViews = 0;
      if (recruiterProfile) {
        const { count: viewsCount } = await supabase
          .from('profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('recruiter_id', recruiterProfile.id);
        totalViews = viewsCount || 0;
      }

      // Get new profiles (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newProfiles } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      setStats({
        totalStudents: totalStudents || 0,
        totalViews,
        newProfiles: newProfiles || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadBookmarkedStudents = async () => {
    if (!user) {
      console.log('No user found, cannot load bookmarks');
      return;
    }

    try {
      console.log('Loading bookmarked students for user:', user.id);
      
      // Step 1: Get the recruiter profile
      const { data: recruiterProfile, error: recruiterError } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (recruiterError) {
        console.error('Error fetching recruiter profile:', recruiterError);
        return;
      }

      if (!recruiterProfile) {
        console.log('No recruiter profile found');
        return;
      }

      console.log('Recruiter profile found:', recruiterProfile.id);

      // Step 2: Get bookmarks for this recruiter
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('student_bookmarks')
        .select('student_user_id')
        .eq('recruiter_id', recruiterProfile.id);

      if (bookmarksError) {
        console.error('Error fetching bookmarks:', bookmarksError);
        return;
      }

      console.log('Bookmarks found:', bookmarks?.length || 0, bookmarks);

      if (!bookmarks || bookmarks.length === 0) {
        console.log('No bookmarks found');
        setBookmarkedStudents([]);
        return;
      }

      // Step 3: Get student profiles for bookmarked students
      const studentUserIds = bookmarks.map(bookmark => bookmark.student_user_id);
      console.log('Student user IDs to fetch:', studentUserIds);

      const { data: studentProfiles, error: studentsError } = await supabase
        .from('student_profiles')
        .select(`
          *,
          student_projects (*)
        `)
        .in('user_id', studentUserIds);

      if (studentsError) {
        console.error('Error fetching student profiles:', studentsError);
        return;
      }

      console.log('Student profiles found:', studentProfiles?.length || 0);

      if (!studentProfiles) {
        setBookmarkedStudents([]);
        return;
      }

      // Step 4: Add email information
      const studentsWithEmail = await Promise.all(
        studentProfiles.map(async (student) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('user_id', student.user_id)
            .single();
          
          return {
            ...student,
            email: profile?.email || '',
            projects: student.student_projects || []
          };
        })
      );

      console.log('Final bookmarked students with email:', studentsWithEmail.length);
      setBookmarkedStudents(studentsWithEmail);
      
    } catch (error) {
      console.error('Error loading bookmarked students:', error);
      setBookmarkedStudents([]);
    }
  };

  const handleViewProfile = async (student: any) => {
    setSelectedStudent(student);
    
    // Increment profile view
    try {
      await supabase.rpc('increment_profile_view', {
        student_user_id: student.user_id
      });
    } catch (error) {
      console.error('Error incrementing profile view:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('recruiter_profiles')
        .upsert({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          company_name: formData.company_name,
          position: formData.position,
          location: formData.location,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your recruiter profile has been saved.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setMajorFilter("");
    setSkillFilter("");
    setLocationFilter("");
    setGraduationYearFilter("");
    setInternshipTypeFilter("");
  };

  const hasActiveFilters = majorFilter || skillFilter || locationFilter || graduationYearFilter || internshipTypeFilter;

  if (selectedStudent) {
    return (
      <StudentProfile
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-xl text-gray-600">Discover and connect with talented students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Students</CardTitle>
              <Users className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs opacity-90">Available profiles</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Bookmarked</CardTitle>
              <Bookmark className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarkedStudents.length}</div>
              <p className="text-xs opacity-90">Saved candidates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">New Profiles</CardTitle>
              <Building className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newProfiles}</div>
              <p className="text-xs opacity-90">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      placeholder="HR Manager, Technical Recruiter, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <LocationAutocomplete
                    value={formData.location}
                    onChange={(value) => setFormData({...formData, location: value})}
                    placeholder="New York, NY, USA"
                    label="Location"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Student Search and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="majorFilter">Major</Label>
                    <Input
                      id="majorFilter"
                      value={majorFilter}
                      onChange={(e) => setMajorFilter(e.target.value)}
                      placeholder="Computer Science, Engineering..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillFilter">Skills</Label>
                    <Input
                      id="skillFilter"
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                      placeholder="React, Python, ML..."
                    />
                  </div>
                  <LocationAutocomplete
                    value={locationFilter}
                    onChange={setLocationFilter}
                    placeholder="Filter by location..."
                    label="Location"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Select value={graduationYearFilter} onValueChange={setGraduationYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="internshipType">Internship Type</Label>
                    <Select value={internshipTypeFilter} onValueChange={setInternshipTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid Only</SelectItem>
                        <SelectItem value="unpaid">Unpaid Only</SelectItem>
                        <SelectItem value="both">Both Paid & Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      disabled={!hasActiveFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Filter className="h-4 w-4" />
                    <span>Showing {filteredStudents.length} of {activeTab === "bookmarks" ? bookmarkedStudents.length : students.length} students</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student List with Tabs */}
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Students ({students.length})</TabsTrigger>
                    <TabsTrigger value="bookmarks">Bookmarked ({bookmarkedStudents.length})</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-sm text-gray-600 mt-2">
                  Active users (logged in recently) are shown first
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading student profiles...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students found matching your criteria.</p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="mt-2"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStudents.map((student) => {
                      const activityStatus = getActivityStatus(student.last_login_at);
                      const projectsWithVideos = student.projects?.filter((p: any) => p.video_url).length || 0;
                      const profileCompletion = calculateProfileCompletion(student);
                      return (
                        <div
                          key={student.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 
                                  className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline"
                                  onClick={() => handleViewProfile(student)}
                                >
                                  {student.name || 'Anonymous Student'}
                                </h3>
                                {activityStatus === 'very-active' && (
                                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    Very Active
                                  </Badge>
                                )}
                                {activityStatus === 'active' && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    Active
                                  </Badge>
                                )}
                                {projectsWithVideos > 0 && (
                                  <Badge variant="default" className="bg-purple-500 hover:bg-purple-600 flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    {projectsWithVideos} Video{projectsWithVideos > 1 ? 's' : ''}
                                  </Badge>
                                )}
                                {student.stipend_expectation && (
                                  <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
                                    <DollarSign className="h-3 w-3" />
                                    {student.stipend_expectation}
                                  </Badge>
                                )}
                                {student.internship_type_preference && (
                                  <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-200">
                                    <Briefcase className="h-3 w-3" />
                                    {student.internship_type_preference === 'both' ? 'Paid & Unpaid' : 
                                     student.internship_type_preference === 'paid' ? 'Paid Only' : 'Unpaid Only'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {student.university || 'University not specified'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Class of {student.graduation_year || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <p>{student.major || 'Major not specified'}</p>
                                {student.location && (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <MapPin className="h-3 w-3" />
                                    {student.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {student.profile_views || 0}
                              </Badge>
                              {student.resume_url && (
                                <Badge variant="outline" className="text-green-600">
                                  Resume
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {student.bio && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {student.bio}
                            </p>
                          )}
                          
                          {student.skills && student.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {student.skills.slice(0, 5).map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {student.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{student.skills.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Code className="h-3 w-3" />
                                {student.skills?.length || 0} skills
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {student.projects?.length || 0} projects
                              </span>
                              {projectsWithVideos > 0 && (
                                <span className="flex items-center gap-1 text-purple-600">
                                  <Video className="h-3 w-3" />
                                  {projectsWithVideos} video{projectsWithVideos > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <BookmarkButton 
                                studentId={student.user_id} 
                                onBookmarkChange={handleBookmarkChange}
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewProfile(student)}
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
