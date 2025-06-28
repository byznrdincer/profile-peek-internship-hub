
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Calendar, Code, Trophy, Video, Briefcase, Activity } from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

interface StudentCardProps {
  student: any;
  onViewProfile: (student: any) => void;
  onBookmarkChange: () => void;
}

const StudentCard = ({ student, onViewProfile, onBookmarkChange }: StudentCardProps) => {
  const getActivityStatus = (lastLoginAt: string | null) => {
    if (!lastLoginAt) return 'inactive';
    
    const now = new Date();
    const lastLogin = new Date(lastLoginAt);
    const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) return 'very-active';
    if (daysDiff <= 30) return 'active';
    return 'inactive';
  };

  const activityStatus = getActivityStatus(student.last_login_at);
  const projectsWithVideos = student.projects?.filter((p: any) => p.video_url).length || 0;
  
  // Get all unique project technologies
  const allProjectTechnologies = student.projects?.reduce((acc: string[], project: any) => {
    if (project.technologies) {
      return [...acc, ...project.technologies];
    }
    return acc;
  }, []) || [];
  
  const uniqueProjectTechnologies = [...new Set(allProjectTechnologies)];

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-3">
        {/* Header section with name and badges */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline truncate"
              onClick={() => onViewProfile(student)}
            >
              {student.name || 'Anonymous Student'}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {student.profile_views || 0}
            </Badge>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          {activityStatus === 'very-active' && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Very Active
            </Badge>
          )}
          {activityStatus === 'active' && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Active
            </Badge>
          )}
          {projectsWithVideos > 0 && (
            <Badge variant="default" className="bg-purple-500 hover:bg-purple-600 flex items-center gap-1">
              <Video className="h-3 w-3" />
              {projectsWithVideos} Video{projectsWithVideos > 1 ? 's' : ''}
            </Badge>
          )}
          {student.internship_type_preference && (
            <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-200">
              <Briefcase className="h-3 w-3" />
              {student.internship_type_preference === 'both' ? 'Paid & Unpaid' : 
               student.internship_type_preference === 'paid' ? 'Paid Only' : 'Unpaid Only'}
            </Badge>
          )}
        </div>

        {/* University and graduation info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {student.university || 'University not specified'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            Class of {student.graduation_year || 'N/A'}
          </span>
        </div>

        {/* Major and location */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
          <p className="truncate">{student.major || 'Major not specified'}</p>
          {student.location && (
            <span className="flex items-center gap-1 text-green-600">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {student.location}
            </span>
          )}
        </div>
        
        {/* Bio */}
        {student.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {student.bio}
          </p>
        )}
        
        {/* Project Technologies Showcase */}
        {uniqueProjectTechnologies.length > 0 && (
          <div className="border-l-4 border-purple-200 pl-3">
            <p className="text-xs font-medium text-purple-700 mb-2">Project Technologies:</p>
            <div className="flex flex-wrap gap-1">
              {uniqueProjectTechnologies.slice(0, 8).map((tech: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {tech}
                </Badge>
              ))}
              {uniqueProjectTechnologies.length > 8 && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  +{uniqueProjectTechnologies.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* General Skills */}
        {student.skills && student.skills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">General Skills:</p>
            <div className="flex flex-wrap gap-1">
              {student.skills.slice(0, 5).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {student.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{student.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Footer with stats and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              {student.skills?.length || 0} skills
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {student.projects?.length || 0} projects
            </span>
            {projectsWithVideos > 0 && (
              <span className="flex items-center gap-1 text-purple-600">
                <Video className="h-3 w-3" />
                {projectsWithVideos} video{projectsWithVideos > 1 ? 's' : ''}
              </span>
            )}
            {uniqueProjectTechnologies.length > 0 && (
              <span className="flex items-center gap-1 text-purple-600 font-medium">
                <Code className="h-3 w-3" />
                {uniqueProjectTechnologies.length} tech stacks
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <BookmarkButton 
              studentId={student.user_id} 
              onBookmarkChange={onBookmarkChange}
            />
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onViewProfile(student)}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
