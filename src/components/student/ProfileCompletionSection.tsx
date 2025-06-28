
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import { StudentProfile } from "@/hooks/useStudentProfile";

interface ProfileCompletionSectionProps {
  profile: StudentProfile;
  projectsCount: number;
  certificationsCount: number;
}

const ProfileCompletionSection = ({ profile, projectsCount, certificationsCount }: ProfileCompletionSectionProps) => {
  const completionItems = [
    { label: "Basic Information", completed: !!(profile.name && profile.email && profile.major) },
    { label: "Skills", completed: profile.skills && profile.skills.length > 0 },
    { label: "Resume", completed: !!profile.resume_url },
    { label: "Projects", completed: projectsCount > 0 },
    { label: "Certifications", completed: certificationsCount > 0 },
    { label: "Internship Preferences", completed: !!(profile.internship_type_preference && profile.preferred_internship_location) },
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Profile Completion
          <span className="text-sm font-normal text-muted-foreground">
            {completionPercentage}% Complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionPercentage} className="w-full" />
        
        <div className="space-y-2">
          {completionItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span className={item.completed ? "text-green-700" : "text-gray-600"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        
        {completionPercentage < 100 && (
          <div className="text-sm text-muted-foreground">
            Complete your profile to increase your visibility to recruiters!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionSection;
