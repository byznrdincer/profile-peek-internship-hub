
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";
import { calculateProfileCompletion, getCompletionColor, getCompletionBadgeColor } from "@/utils/profileUtils";

interface ProfileCompletionCardProps {
  student: any;
}

const ProfileCompletionCard = ({ student }: ProfileCompletionCardProps) => {
  const completionPercentage = calculateProfileCompletion(student);
  
  const getSuggestions = () => {
    const suggestions = [];
    if (!student.bio) suggestions.push("Add a bio");
    if (!student.phone) suggestions.push("Add phone number");
    if (!student.location) suggestions.push("Add location");
    if (!student.skills || student.skills.length === 0) suggestions.push("Add skills");
    if (!student.projects || student.projects.length === 0) suggestions.push("Add projects");
    if (!student.github_url) suggestions.push("Add GitHub profile");
    if (!student.linkedin_url) suggestions.push("Add LinkedIn profile");
    return suggestions.slice(0, 3); // Show top 3 suggestions
  };

  const suggestions = getSuggestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {completionPercentage >= 80 ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Progress</span>
            <Badge variant={getCompletionBadgeColor(completionPercentage)}>
              {completionPercentage}%
            </Badge>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        {suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestions</h4>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
