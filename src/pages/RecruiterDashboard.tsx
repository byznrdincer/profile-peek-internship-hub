
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Building, Eye, User, MapPin, Calendar, Code, Trophy, Mail, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import StudentProfile from "@/components/StudentProfile";

const RecruiterDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
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

  // Load recruiter profile and students
  useEffect(() => {
    if (user) {
      loadProfile();
      loadStudents();
      loadStats();
    }
  }, [user]);

  // Filter students based on search term and skill filter
  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (skillFilter) {
      filtered = filtered.filter(student =>
        student.skills?.some((skill: string) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, skillFilter]);

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
              <CardTitle className="text-sm font-medium opacity-90">Profile Views</CardTitle>
              <Eye className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs opacity-90">Total views by you</p>
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
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="New York, NY"
                    />
                  </div>
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
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="search">Search Students</Label>
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, university, major, or bio..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillFilter">Filter by Skill</Label>
                    <Input
                      id="skillFilter"
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                      placeholder="e.g., React, Python, Machine Learning..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Student Profiles ({filteredStudents.length})
                </CardTitle>
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleViewProfile(student)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-600">{student.name || 'Anonymous Student'}</h3>
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
                            <p className="text-sm text-gray-700 mt-1">{student.major || 'Major not specified'}</p>
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
                          </div>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
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
