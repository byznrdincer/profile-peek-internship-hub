
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Calendar, Code, Trophy, Video, DollarSign, Briefcase, Activity } from "lucide-react";
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

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 
              className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline"
              onClick={() => onViewProfile(student)}
            >
              {student.name || 'Anonymous Student'}
            </h3>
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
            {student.stipend_expectation && (
              <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
                <DollarSign className="h-3 w-3" />
                {student.stipend_expectation}
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
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {student.university || 'University not specified'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Class of {student.graduation_year || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <p>{student.major || 'Major not specified'}</p>
            {student.location && (
              <span className="flex items-center gap-1 text-green-600">
                <MapPin className="h-3 w-3" />
                {student.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {student.profile_views || 0}
          </Badge>
          {student.resume_url && (
            <Badge variant="outline" className="text-green-600">
              Resume
            </Badge>
          )}
        </div>
      </div>
      
      {student.bio && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {student.bio}
        </p>
      )}
      
      {student.skills && student.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
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
      )}
      
      <div className="flex items-center justify-between">
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
        </div>
        <div className="flex items-center gap-2">
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
  );
};

export default StudentCard;
