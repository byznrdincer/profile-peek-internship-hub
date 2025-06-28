
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
  // Common skills for the projects section
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
    "React", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask", "Spring", "Laravel",
    "HTML", "CSS", "SCSS", "Tailwind CSS", "Bootstrap", "Material-UI", "Styled Components",
    "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase", "Supabase",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub Actions",
    "Machine Learning", "Data Science", "AI", "TensorFlow", "PyTorch", "Pandas", "NumPy"
  ];

  // Generate graduation year options
  const graduationYearOptions = Array.from({ length: 16 }, (_, i) => {
    const year = 2015 + i;
    return year.toString();
  });

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
          formData={{
            name: profile.name || "",
            email: profile.email || "",
            university: profile.university || "",
            major: profile.major || "",
            graduation_year: profile.graduation_year || "",
            location: profile.location || "",
            phone: profile.phone || "",
            bio: profile.bio || "",
            github_url: profile.github_url || "",
            website_url: profile.website_url || "",
            linkedin_url: profile.linkedin_url || "",
            internship_type_preference: profile.internship_type_preference || "",
            preferred_internship_location: profile.preferred_internship_location || "",
            preferred_locations: profile.preferred_locations || [],
            open_to_relocate: profile.open_to_relocate || false,
            multiple_website_urls: profile.multiple_website_urls || [],
          }}
          setFormData={(data) => onUpdateProfile(data)}
          graduationYearOptions={graduationYearOptions}
        />
      </TabsContent>

      <TabsContent value="skills" className="space-y-4">
        <SkillsSection
          skills={profile.skills || []}
          setSkills={(skills) => onUpdateProfile({ skills })}
          commonSkills={commonSkills}
        />
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <ProjectsSection
          projects={projects}
          setProjects={() => onRefreshProjects()}
          commonSkills={commonSkills}
        />
      </TabsContent>

      <TabsContent value="certifications" className="space-y-4">
        <CertificationsSection
          certifications={certifications}
          setCertifications={() => onRefreshCertifications()}
        />
      </TabsContent>

      <TabsContent value="internships" className="space-y-4">
        <InternshipPreferencesSection
          formData={{
            internship_type_preference: profile.internship_type_preference || "",
            paid_internship_preference: profile.paid_internship_preference || "",
            preferred_internship_location: profile.preferred_internship_location || "",
            preferred_locations: profile.preferred_locations || [],
            open_to_relocate: profile.open_to_relocate || false,
          }}
          setFormData={(data) => onUpdateProfile(data)}
        />
      </TabsContent>

      <TabsContent value="resume" className="space-y-4">
        <ResumeUploadSection
          resumeUrl={profile.resume_url}
          onResumeUpdate={(resumeUrl) => onUpdateProfile({ resume_url: resumeUrl })}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
