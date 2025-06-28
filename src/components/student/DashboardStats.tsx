
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Award, Briefcase } from "lucide-react";
import { StudentProfile } from "@/hooks/useStudentProfile";

interface DashboardStatsProps {
  profile: StudentProfile;
  projectsCount: number;
  certificationsCount: number;
}

const DashboardStats = ({ profile, projectsCount, certificationsCount }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile.profile_views || 0}</div>
          <p className="text-xs text-muted-foreground">
            Times your profile was viewed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectsCount}</div>
          <p className="text-xs text-muted-foreground">
            Projects in your portfolio
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certifications</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{certificationsCount}</div>
          <p className="text-xs text-muted-foreground">
            Certifications earned
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
