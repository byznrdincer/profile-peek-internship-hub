import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import StatsCards from "@/components/recruiter/StatsCards";
import ProfileForm from "@/components/recruiter/ProfileForm";
import StudentFilters from "@/components/recruiter/StudentFilters";
import StudentList from "@/components/recruiter/StudentList";
import StudentProfile from "@/components/StudentProfile";

const RecruiterDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [bookmarkedStudents, setBookmarkedStudents] = useState<any[]>([]);
  const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
  
  // Filter states
  const [majorFilter, setMajorFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [graduationYearFilter, setGraduationYearFilter] = useState("");
  const [projectTechFilter, setProjectTechFilter] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      console.log("User authenticated, loading recruiter data...", user);
      loadRecruiterProfile();
      loadBookmarkedStudents();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [students, bookmarkedStudents, majorFilter, skillsFilter, locationFilter, graduationYearFilter, projectTechFilter]);

  const loadRecruiterProfile = async () => {
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('recruiter_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && profile) {
      setRecruiterProfile(profile);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    setStudentsLoaded(true);
    
    try {
      // First get student profiles with projects
      const { data: studentsData, error: studentsError } = await supabase
        .from('student_profiles')
        .select(`
          *,
          projects:student_projects(*)
        `)
        .order('last_login_at', { ascending: false, nullsFirst: false });

      if (studentsError) throw studentsError;

      if (studentsData) {
        console.log("Students loaded with email field:", studentsData);
        setStudents(studentsData);
      }
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

  const loadBookmarkedStudents = async () => {
    if (!user) return;

    console.log("Loading bookmarked students for user:", user.id);
    
    try {
      // Get recruiter profile first
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!recruiterProfile) {
        console.log("No recruiter profile found");
        return;
      }

      console.log("Recruiter profile found:", recruiterProfile.id);

      // Get bookmarked student user IDs
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('student_bookmarks')
        .select('student_user_id')
        .eq('recruiter_id', recruiterProfile.id);

      if (bookmarksError) throw bookmarksError;

      console.log("Bookmarks found:", bookmarks?.length, bookmarks);

      if (bookmarks && bookmarks.length > 0) {
        const studentUserIds = bookmarks.map(b => b.student_user_id);
        console.log("Student user IDs to fetch:", studentUserIds);

        // Get full student profiles for bookmarked students
        const { data: studentsData, error: studentsError } = await supabase
          .from('student_profiles')
          .select(`
            *,
            projects:student_projects(*)
          `)
          .in('user_id', studentUserIds)
          .order('last_login_at', { ascending: false, nullsFirst: false });

        if (studentsError) throw studentsError;

        console.log("Student profiles found:", studentsData?.length);
        console.log("Final bookmarked students with email:", studentsData?.length);
        
        if (studentsData) {
          setBookmarkedStudents(studentsData);
        }
      } else {
        setBookmarkedStudents([]);
      }
    } catch (error) {
      console.error('Error loading bookmarked students:', error);
    }
  };

  const applyFilters = () => {
    const currentStudents = activeTab === "all" ? students : bookmarkedStudents;
    
    let filtered = currentStudents.filter(student => {
      // Major filter
      if (majorFilter && !student.major?.toLowerCase().includes(majorFilter.toLowerCase())) {
        return false;
      }

      // Skills filter
      if (skillsFilter.length > 0) {
        const studentSkills = student.skills || [];
        const hasMatchingSkill = skillsFilter.some(skill => 
          studentSkills.some((studentSkill: string) => 
            studentSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }

      // Location filter
      if (locationFilter && !student.location?.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      // Graduation year filter
      if (graduationYearFilter && student.graduation_year !== graduationYearFilter) {
        return false;
      }

      // Project technology filter
      if (projectTechFilter.length > 0) {
        const projectTechnologies = student.projects?.reduce((acc: string[], project: any) => {
          if (project.technologies) {
            return [...acc, ...project.technologies];
          }
          return acc;
        }, []) || [];
        
        const hasMatchingTech = projectTechFilter.some(tech => 
          projectTechnologies.some((projectTech: string) => 
            projectTech.toLowerCase().includes(tech.toLowerCase())
          )
        );
        if (!hasMatchingTech) return false;
      }

      return true;
    });

    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setMajorFilter("");
    setSkillsFilter([]);
    setLocationFilter("");
    setGraduationYearFilter("");
    setProjectTechFilter([]);
  };

  const hasActiveFilters = majorFilter || skillsFilter.length > 0 || locationFilter || graduationYearFilter || projectTechFilter.length > 0;

  const handleViewProfile = async (student: any) => {
    // Increment profile view count
    try {
      await supabase.rpc('increment_profile_view', {
        student_user_id: student.user_id
      });
    } catch (error) {
      console.error('Error incrementing profile view:', error);
    }
    
    setSelectedStudent(student);
  };

  const handleBookmarkChange = () => {
    loadBookmarkedStudents();
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setRecruiterProfile(updatedProfile);
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
          <p className="text-xl text-gray-600">Find and connect with talented students</p>
        </div>

        <StatsCards 
          stats={{
            totalStudents: students.length,
            totalViews: 0,
            newProfiles: 0
          }}
          bookmarkedCount={bookmarkedStudents.length}
        />

        {!recruiterProfile?.name && (
          <div className="mb-8">
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
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <StudentFilters
              majorFilter={majorFilter}
              setMajorFilter={setMajorFilter}
              skillsFilter={skillsFilter}
              setSkillsFilter={setSkillsFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              graduationYearFilter={graduationYearFilter}
              setGraduationYearFilter={setGraduationYearFilter}
              projectTechFilter={projectTechFilter}
              setProjectTechFilter={setProjectTechFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              onLoadStudents={loadStudents}
            />
          </div>

          <div className="lg:col-span-3">
            <StudentList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={loading}
              filteredStudents={filteredStudents}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onViewProfile={handleViewProfile}
              onBookmarkChange={handleBookmarkChange}
              studentsCount={students.length}
              bookmarkedCount={bookmarkedStudents.length}
              studentsLoaded={studentsLoaded}
              onLoadAllStudents={loadStudents}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
