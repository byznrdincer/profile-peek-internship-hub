
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Code, Trophy } from "lucide-react";
import ProfileCompletionCard from "@/components/ProfileCompletionCard";

interface StatsCardsProps {
  profileViews: number;
  skillsCount: number;
  projectsCount: number;
  studentProfile: any;
  skills: string[];
  projects: any[];
}

const StatsCards = ({ 
  profileViews, 
  skillsCount, 
  projectsCount, 
  studentProfile, 
  skills, 
  projects 
}: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Profile Views</CardTitle>
          <Eye className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profileViews}</div>
          <p className="text-xs opacity-90">Total views</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Skills Added</CardTitle>
          <Code className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{skillsCount}</div>
          <p className="text-xs opacity-90">Keep adding more!</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Projects</CardTitle>
          <Trophy className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectsCount}</div>
          <p className="text-xs opacity-90">Showcase your work</p>
        </CardContent>
      </Card>

      {studentProfile && (
        <div className="md:col-span-1">
          <ProfileCompletionCard student={{
            ...studentProfile,
            skills,
            projects
          }} />
        </div>
      )}
    </div>
  );
};

export default StatsCards;
