import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ProfileForm from "@/components/recruiter/ProfileForm";
import StudentFilters from "@/components/recruiter/StudentFilters";
import StudentList from "@/components/recruiter/StudentList";
import StudentProfile from "@/components/StudentProfile";
import { useStudentFilters } from "@/hooks/useStudentFilters";

const RecruiterDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [students, setStudents] = useState<any[]>([]);
  const [bookmarkedStudents, setBookmarkedStudents] = useState<any[]>([]);
  const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const {
    filteredStudents,
    majorFilter,
    setMajorFilter,
    skillFilter,
    setSkillFilter,
    projectSkillFilter,
    setProjectSkillFilter,
    locationFilter,
    setLocationFilter,
    graduationYearFilter,
    setGraduationYearFilter,
    internshipTypeFilter,
    setInternshipTypeFilter,
    clearFilters,
    hasActiveFilters
  } = useStudentFilters(students, bookmarkedStudents, activeTab);

  useEffect(() => {
    loadAllStudents();
    loadBookmarkedStudents();
    loadRecruiterProfile();
  }, []);

  const loadAllStudents = async () => {
    try {
      const res = await fetch("/api/recruiter/students/");
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const loadBookmarkedStudents = async () => {
    try {
      const res = await fetch("/api/recruiter/bookmarks/");
      const data = await res.json();
      setBookmarkedStudents(data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
  };

  const loadRecruiterProfile = async () => {
    try {
      const res = await fetch("/api/recruiter/profile/");
      const data = await res.json();
      setRecruiterProfile(data);
      setProfileLoading(false);
    } catch (error) {
      console.error("Failed to load recruiter profile:", error);
    }
  };

  const handleViewProfile = async (student: any) => {
    try {
      await fetch(`/api/student/increment-profile-views/${student.user_id}/`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing profile view:", error);
    }
    setSelectedStudent(student);
  };

  const handleBookmarkChange = () => {
    loadBookmarkedStudents();
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    console.log("Dashboard received profile update:", updatedProfile);
    setTimeout(() => {
      loadRecruiterProfile();
    }, 500);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
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

        {(!recruiterProfile?.name && !profileLoading) && (
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Complete Your Profile</h2>
              <p className="text-yellow-700 mb-4">Please fill out your profile information to get started with recruiting.</p>
            </div>
            <ProfileForm 
              initialData={{
                name: recruiterProfile?.name || "",
                phone: recruiterProfile?.phone || "",
                company_name: recruiterProfile?.company_name || "",
                position: recruiterProfile?.position || "",
                location: recruiterProfile?.location || ""
              }}
              onUpdate={handleProfileUpdate}
              loading={profileLoading}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <StudentFilters
              majorFilter={majorFilter}
              setMajorFilter={setMajorFilter}
              skillFilter={skillFilter}
              setSkillFilter={setSkillFilter}
              projectSkillFilter={projectSkillFilter}
              setProjectSkillFilter={setProjectSkillFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              graduationYearFilter={graduationYearFilter}
              setGraduationYearFilter={setGraduationYearFilter}
              internshipTypeFilter={internshipTypeFilter}
              setInternshipTypeFilter={setInternshipTypeFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              filteredCount={filteredStudents.length}
              totalCount={students.length}
            />
          </div>

          <div className="lg:col-span-3">
            <StudentList
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              loading={loading}
              filteredStudents={filteredStudents}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onViewProfile={handleViewProfile}
              onBookmarkChange={handleBookmarkChange}
              studentsCount={students.length}
              bookmarkedCount={bookmarkedStudents.length}
              studentsLoaded={true}
              onLoadAllStudents={loadAllStudents}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
