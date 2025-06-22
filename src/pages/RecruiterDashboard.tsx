
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import StudentProfile from "@/components/StudentProfile";
import StatsCards from "@/components/recruiter/StatsCards";
import ProfileForm from "@/components/recruiter/ProfileForm";
import StudentFilters from "@/components/recruiter/StudentFilters";
import StudentList from "@/components/recruiter/StudentList";

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

  const getActivityStatus = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'inactive';
    
    const now = new Date();
    const lastLogin = new Date(lastLoginAt);
    const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) return 'very-active';
    if (daysDiff <= 30) return 'active';
    return 'inactive';
  };

  const handleBookmarkChange = () => {
    console.log('handleBookmarkChange called - refreshing bookmarks');
    loadBookmarkedStudents();
    loadStats();
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
      const { count: totalStudents } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });

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
    
    try {
      await supabase.rpc('increment_profile_view', {
        student_user_id: student.user_id
      });
    } catch (error) {
      console.error('Error incrementing profile view:', error);
    }
  };

  const clearAllFilters = () => {
    setMajorFilter("");
    setSkillFilter("");
    setLocationFilter("");
    setGraduationYearFilter("");
    setInternshipTypeFilter("");
  };

  const hasActiveFilters = Boolean(majorFilter || skillFilter || locationFilter || graduationYearFilter || internshipTypeFilter);

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

        <StatsCards stats={stats} bookmarkedCount={bookmarkedStudents.length} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <ProfileForm 
              initialData={formData} 
              onUpdate={(data) => setFormData(data)} 
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <StudentFilters
              majorFilter={majorFilter}
              setMajorFilter={setMajorFilter}
              skillFilter={skillFilter}
              setSkillFilter={setSkillFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              graduationYearFilter={graduationYearFilter}
              setGraduationYearFilter={setGraduationYearFilter}
              internshipTypeFilter={internshipTypeFilter}
              setInternshipTypeFilter={setInternshipTypeFilter}
              onClearFilters={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
              filteredCount={filteredStudents.length}
              totalCount={activeTab === "bookmarks" ? bookmarkedStudents.length : students.length}
            />

            <StudentList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={loading}
              filteredStudents={filteredStudents}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearAllFilters}
              onViewProfile={handleViewProfile}
              onBookmarkChange={handleBookmarkChange}
              studentsCount={students.length}
              bookmarkedCount={bookmarkedStudents.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
