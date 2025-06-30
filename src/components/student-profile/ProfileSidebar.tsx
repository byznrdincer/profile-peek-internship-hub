
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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
    </div>
  );
};

export default ProfileSidebar;
