
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye } from "lucide-react";
import BookmarkButton from "../BookmarkButton";

interface ProfileHeaderProps {
  student: any;
  onBack: () => void;
}

const ProfileHeader = ({ student, onBack }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {student.profile_views} views
        </Badge>
        <BookmarkButton studentId={student.user_id} />
      </div>
    </div>
  );
};

export default ProfileHeader;
