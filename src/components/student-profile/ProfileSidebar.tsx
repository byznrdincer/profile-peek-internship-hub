
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSidebarProps {
  student: any;
  certifications: any[];
}

const ProfileSidebar = ({ student, certifications }: ProfileSidebarProps) => {
  const { toast } = useToast();

  const handleDownloadResume = async () => {
    if (!student.resume_url) {
      toast({
        title: "No resume available",
        description: "This student hasn't uploaded a resume yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const urlParts = student.resume_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${student.user_id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = student.resume_filename || fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume downloaded",
        description: `${student.name}'s resume has been downloaded`,
      });
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContact = () => {
    if (!student.email) {
      toast({
        title: "Email not available",
        description: "This student's email address is not available.",
        variant: "destructive",
      });
      return;
    }

    const subject = encodeURIComponent(`Regarding your profile on InternUpload`);
    const body = encodeURIComponent(`Hi ${student.name},\n\nI found your profile on InternUpload and would like to discuss potential opportunities.\n\nBest regards`);
    const mailtoUrl = `mailto:${student.email}?subject=${subject}&body=${body}`;
    
    window.open(mailtoUrl, '_blank');
    
    toast({
      title: "Contact initiated",
      description: `Opening email to contact ${student.name}`,
    });
  };

  const handleLinkClick = (url: string, platform: string) => {
    window.open(url, '_blank');
    toast({
      title: "Opening link",
      description: `Opening ${student.name}'s ${platform} profile`,
    });
  };

  const getInternshipTypeDisplay = (preference: string) => {
    switch (preference) {
      case 'paid':
        return 'Paid Only';
      case 'unpaid':
        return 'Unpaid Only';
      case 'both':
        return 'Both Paid & Unpaid';
      default:
        return 'Not specified';
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleDownloadResume}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            disabled={!student.resume_url}
          >
            <Download className="h-4 w-4 mr-2" />
            {student.resume_url ? "Download Resume" : "No Resume Available"}
          </Button>
          <Button
            onClick={handleContact}
            variant="outline"
            className="w-full"
            disabled={!student.email}
          >
            <Mail className="h-4 w-4 mr-2" />
            {student.email ? "Contact Student" : "Email Not Available"}
          </Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      {(student.github_url || student.linkedin_url || student.website_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Links & Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.github_url && (
              <Button
                onClick={() => handleLinkClick(student.github_url, 'GitHub')}
                variant="outline"
                className="w-full justify-start"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub Profile
              </Button>
            )}
            {student.linkedin_url && (
              <Button
                onClick={() => handleLinkClick(student.linkedin_url, 'LinkedIn')}
                variant="outline"
                className="w-full justify-start"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn Profile
              </Button>
            )}
            {student.website_url && (
              <Button
                onClick={() => handleLinkClick(student.website_url, 'website')}
                variant="outline"
                className="w-full justify-start"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Personal Website
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Profile Views</span>
            <span className="font-semibold">{student.profile_views || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Skills Listed</span>
            <span className="font-semibold">{student.skills?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Projects</span>
            <span className="font-semibold">{student.projects?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Project Videos</span>
            <span className="font-semibold">
              {student.projects?.filter((p: any) => p.video_url).length || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Graduation</span>
            <span className="font-semibold">{student.graduation_year}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Resume</span>
            <span className="font-semibold">{student.resume_url ? "Available" : "Not uploaded"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Certifications</span>
            <span className="font-semibold">{certifications.length}</span>
          </div>
          {student.internship_type_preference && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Internship Type</span>
              <span className="font-semibold">{getInternshipTypeDisplay(student.internship_type_preference)}</span>
            </div>
          )}
          {student.preferred_internship_location && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Preferred Location</span>
              <span className="font-semibold">{student.preferred_internship_location}</span>
            </div>
          )}
          {student.open_to_relocate !== null && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Open to Relocate</span>
              <span className="font-semibold">{student.open_to_relocate ? "Yes" : "No"}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
