
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoSection from "./PersonalInfoSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import CertificationsSection from "./CertificationsSection";
import InternshipPreferencesSection from "./InternshipPreferencesSection";
import ResumeUploadSection from "./ResumeUploadSection";
import { StudentProfile } from "@/hooks/useStudentProfile";

interface DashboardContentProps {
  profile: StudentProfile;
  projects: any[];
  certifications: any[];
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onRefreshProjects: () => void;
  onRefreshCertifications: () => void;
}

const DashboardContent = ({
  profile,
  projects,
  certifications,
  onUpdateProfile,
  onRefreshProjects,
  onRefreshCertifications
}: DashboardContentProps) => {
  const handlePersonalInfoUpdate = (data: any) => {
    const updates = {
      name: data.name,
      email: data.email,
      major: data.major,
      graduation_year: data.graduation_year,
      gpa: data.gpa,
      location: data.location,
      phone: data.phone,
      bio: data.bio,
      github_url: data.github_url,
      website_url: data.website_url,
      linkedin_url: data.linkedin_url,
      internship_type_preference: data.internship_type_preference,
      paid_internship_preference: (profile as any).paid_internship_preference || "",
      preferred_internship_location: data.preferred_internship_location,
      preferred_locations: data.preferred_locations,
      open_to_relocate: data.open_to_relocate,
    };
    onUpdateProfile(updates);
  };

  const handleSkillsUpdate = (skills: string[]) => {
    onUpdateProfile({ skills });
  };

  const handleInternshipPreferencesUpdate = (data: any) => {
    const updates = {
      internship_type_preference: data.internship_type_preference,
      paid_internship_preference: data.paid_internship_preference,
      preferred_internship_location: data.preferred_internship_location,
      preferred_locations: data.preferred_locations,
      open_to_relocate: data.open_to_relocate,
    };
    onUpdateProfile(updates);
  };

  const handleResumeUpdate = (resumeUrl: string) => {
    onUpdateProfile({ resume_url: resumeUrl });
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="internships">Internships</TabsTrigger>
        <TabsTrigger value="resume">Resume</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        <PersonalInfoSection
          initialData={{
            name: profile.name || "",
            email: profile.email || "",
            major: profile.major || "",
            graduation_year: profile.graduation_year || "",
            gpa: profile.gpa || "",
            location: profile.location || "",
            phone: profile.phone || "",
            bio: profile.bio || "",
            github_url: profile.github_url || "",
            website_url: profile.website_url || "",
            linkedin_url: profile.linkedin_url || "",
          }}
          onUpdate={handlePersonalInfoUpdate}
        />
      </TabsContent>

      <TabsContent value="skills" className="space-y-4">
        <SkillsSection
          initialSkills={profile.skills || []}
          onUpdate={handleSkillsUpdate}
        />
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <ProjectsSection
          projects={projects}
          onRefresh={onRefreshProjects}
        />
      </TabsContent>

      <TabsContent value="certifications" className="space-y-4">
        <CertificationsSection
          certifications={certifications}
          onRefresh={onRefreshCertifications}
        />
      </TabsContent>

      <TabsContent value="internships" className="space-y-4">
        <InternshipPreferencesSection
          initialData={{
            internship_type_preference: profile.internship_type_preference || "",
            paid_internship_preference: (profile as any).paid_internship_preference || "",
            preferred_internship_location: profile.preferred_internship_location || "",
            preferred_locations: profile.preferred_locations || [],
            open_to_relocate: profile.open_to_relocate || false,
          }}
          onUpdate={handleInternshipPreferencesUpdate}
        />
      </TabsContent>

      <TabsContent value="resume" className="space-y-4">
        <ResumeUploadSection
          currentResumeUrl={profile.resume_url}
          onUpdate={handleResumeUpdate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
