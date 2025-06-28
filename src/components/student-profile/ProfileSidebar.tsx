
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Globe, Award, MapPin, Calendar, GraduationCap, Building } from "lucide-react";
import BookmarkButton from "../BookmarkButton";

interface ProfileSidebarProps {
  student: any;
  certifications: any[];
}

const ProfileSidebar = ({ student, certifications }: ProfileSidebarProps) => {
  const hasMultipleWebsites = student.multiple_website_urls && student.multiple_website_urls.length > 0;
  const hasLegacyWebsite = student.website_url;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <BookmarkButton studentId={student.user_id} />
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-500" />
            <span>{student.university}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <span>{student.major}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Class of {student.graduation_year}</span>
          </div>
          {student.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{student.location}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {student.github_url && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={student.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub Profile
              </a>
            </Button>
          )}
          {student.linkedin_url && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn Profile
              </a>
            </Button>
          )}
          
          {/* Multiple Website Links */}
          {hasMultipleWebsites && (
            <div className="space-y-2">
              {student.multiple_website_urls
                .filter((url: string) => url && url.trim())
                .map((url: string, index: number) => (
                  <Button key={index} variant="outline" className="w-full justify-start" asChild>
                    <a 
                      href={url.startsWith('http') ? url : `https://${url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website {index + 1}
                    </a>
                  </Button>
                ))}
            </div>
          )}
          
          {/* Legacy Website Link */}
          {hasLegacyWebsite && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a 
                href={student.website_url.startsWith('http') ? student.website_url : `https://${student.website_url}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4 mr-2" />
                Portfolio
              </a>
            </Button>
          )}
          
          {!student.github_url && !student.linkedin_url && !hasMultipleWebsites && !hasLegacyWebsite && (
            <p className="text-sm text-gray-500 italic">No social links provided</p>
          )}
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
