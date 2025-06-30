
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, FileText } from "lucide-react";
import BookmarkButton from "../BookmarkButton";
import { generateStudentProfilePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface ProfileSidebarProps {
  student: any;
  certifications: any[];
}

const ProfileSidebar = ({ student, certifications }: ProfileSidebarProps) => {
  const { toast } = useToast();

  const handleGeneratePDF = () => {
    try {
      generateStudentProfilePDF(student, certifications);
      toast({
        title: "PDF Generated",
        description: "Student profile summary has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <BookmarkButton studentId={student.user_id} />
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleGeneratePDF}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF Summary
          </Button>
        </CardContent>
      </Card>

      {/* Certifications Summary */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications ({certifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {certifications.slice(0, 3).map((cert, index) => (
                <Badge key={index} variant="secondary" className="w-full justify-start text-xs">
                  {cert.certification_name}
                </Badge>
              ))}
              {certifications.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{certifications.length - 3} more certifications
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSidebar;
