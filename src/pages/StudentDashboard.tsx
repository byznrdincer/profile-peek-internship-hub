
import Navigation from "@/components/Navigation";
import DashboardStats from "@/components/student/DashboardStats";
import ProfileCompletionSection from "@/components/student/ProfileCompletionSection";
import DashboardContent from "@/components/student/DashboardContent";
import { useStudentProfile } from "@/hooks/useStudentProfile";

const StudentDashboard = () => {
  const {
    profile,
    projects,
    certifications,
    loading,
    updateProfile,
    refreshProjects,
    refreshCertifications
  } = useStudentProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Profile not found. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.name || 'Student'}!
          </h1>
          <p className="text-xl text-gray-600">
            Manage your profile and showcase your skills to potential employers
          </p>
        </div>

        <div className="space-y-8">
          <DashboardStats
            profile={profile}
            projectsCount={projects.length}
            certificationsCount={certifications.length}
          />

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileCompletionSection
                profile={profile}
                projectsCount={projects.length}
                certificationsCount={certifications.length}
              />
            </div>

            <div className="lg:col-span-3">
              <DashboardContent
                profile={profile}
                projects={projects}
                certifications={certifications}
                onUpdateProfile={updateProfile}
                onRefreshProjects={refreshProjects}
                onRefreshCertifications={refreshCertifications}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
