
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "./student-profile/ProfileHeader";
import PersonalInfoCard from "./student-profile/PersonalInfoCard";
import LocationPreferencesCard from "./student-profile/LocationPreferencesCard";
import SkillsCard from "./student-profile/SkillsCard";
import CertificationsCard from "./student-profile/CertificationsCard";
import ProjectsCard from "./student-profile/ProjectsCard";
import ProfileSidebar from "./student-profile/ProfileSidebar";

interface StudentProfileProps {
  student: any;
  onBack: () => void;
}

const StudentProfile = ({ student, onBack }: StudentProfileProps) => {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<any[]>([]);
  const [studentData, setStudentData] = useState(student);

  useEffect(() => {
    loadCertifications();
    loadCompleteStudentData();
  }, [student]);

  const loadCompleteStudentData = async () => {
    if (!student?.user_id) return;

    try {
      // Get complete student profile data
      const { data: completeStudent, error: studentError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', student.user_id)
        .single();

      if (studentError) {
        console.error('Error loading complete student data:', studentError);
        return;
      }

      // Get user email from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', student.user_id)
        .single();

      if (!profileError && profileData) {
        // Merge all data including email from profiles table
        setStudentData({ 
          ...student, 
          ...completeStudent,
          email: profileData.email 
        });
      } else {
        // Just merge student profile data if profiles fetch fails
        setStudentData({ ...student, ...completeStudent });
      }
    } catch (error) {
      console.error('Error loading complete student data:', error);
    }
  };

  const loadCertifications = async () => {
    if (!student?.user_id) return;

    try {
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', student.user_id)
        .single();

      if (studentProfile) {
        const { data: certificationsData, error } = await supabase
          .from('student_certifications')
          .select('*')
          .eq('student_id', studentProfile.id);

        if (!error && certificationsData) {
          setCertifications(certificationsData);
        }
      }
    } catch (error) {
      console.error('Error loading certifications:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader student={studentData} onBack={onBack} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoCard student={studentData} />
            <LocationPreferencesCard student={studentData} />
            <SkillsCard student={studentData} />
            <CertificationsCard certifications={certifications} />
            <ProjectsCard student={studentData} />
          </div>

          {/* Sidebar */}
          <ProfileSidebar student={studentData} certifications={certifications} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
