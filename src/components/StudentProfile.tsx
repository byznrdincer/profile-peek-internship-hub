import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Mail, MapPin, Calendar, Code, Trophy, Eye, Video, Play, Github, Linkedin, ExternalLink, Clock, DollarSign, MapPinIcon, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BookmarkButton from "./BookmarkButton";
import { useState, useEffect } from "react";

interface StudentProfileProps {
  student: any;
  onBack: () => void;
}

const StudentProfile = ({ student, onBack }: StudentProfileProps) => {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<any[]>([]);

  // Load certifications when component mounts
  useEffect(() => {
    loadCertifications();
  }, [student]);

  const loadCertifications = async () => {
    if (!student?.user_id) return;

    try {
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', student.user_id)
        .single();

      if (studentProfile) {
        const { data: certificationsData, error } = await supabase
          .from('student_certifications')
          .select('*')
          .eq('student_id', studentProfile.id);

        if (!error && certificationsData) {
          setCertifications(certificationsData);
        }
      }
    } catch (error) {
      console.error('Error loading certifications:', error);
    }
  };

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
      // Extract the file path from the URL
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

      // Create download link
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
    console.log('Student data:', student);
    console.log('Student email:', student.email);
    
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
    
    console.log('Opening mailto URL:', mailtoUrl);
    window.open(mailtoUrl, '_blank');
    
    toast({
      title: "Contact initiated",
      description: `Opening email to contact ${student.name}`,
    });
  };

  const handleWatchVideo = (videoUrl: string, projectTitle: string) => {
    window.open(videoUrl, '_blank');
    toast({
      title: "Opening video",
      description: `Watching ${projectTitle} project video`,
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

  const getInternshipTypeBadgeColor = (preference: string) => {
    switch (preference) {
      case 'paid':
        return 'bg-green-500 hover:bg-green-600';
      case 'unpaid':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'both':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleDownloadCertificate = async (certification: any) => {
    if (!certification.certificate_file_url) return;

    try {
      const response = await fetch(certification.certificate_file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certification.certificate_filename || 'certificate';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Certificate downloaded",
        description: "Certificate has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the certificate.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          </div>
          <BookmarkButton studentId={student.user_id} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-blue-600 mb-2">{student.name}</CardTitle>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {student.location || 'Location not specified'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Class of {student.graduation_year}
                      </span>
                    </div>
                    <p className="text-lg text-gray-700 mt-2">{student.major}</p>
                    <p className="text-sm text-gray-600 mt-1">{student.university}</p>
                    
                    {/* Updated availability and preferences section */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {student.availability_status && (
                        <Badge variant={student.availability_status === 'Available' ? 'default' : 'secondary'} className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {student.availability_status}
                        </Badge>
                      )}
                      {student.preferred_internship_location && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          Prefers: {student.preferred_internship_location}
                        </Badge>
                      )}
                      {student.open_to_relocate && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                          <MapPinIcon className="h-3 w-3" />
                          Open to Relocate
                        </Badge>
                      )}
                      {student.internship_type_preference && (
                        <Badge className={`flex items-center gap-1 text-white ${getInternshipTypeBadgeColor(student.internship_type_preference)}`}>
                          <Banknote className="h-3 w-3" />
                          {getInternshipTypeDisplay(student.internship_type_preference)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {student.profile_views} views
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600 leading-relaxed">{student.bio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      <strong>Phone:</strong> {student.phone}
                    </p>
                    {student.email && (
                      <p className="text-sm text-gray-500">
                        <strong>Email:</strong> {student.email}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Internship Preferences Card */}
            {(student.internship_type_preference || student.preferred_internship_location || student.open_to_relocate) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Location & Internship Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Location Preferences */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Location Preferences</h4>
                      
                      {student.preferred_internship_location && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Preferred Location</p>
                          <p className="text-gray-900">{student.preferred_internship_location}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open to Relocate</p>
                        <div className="flex items-center gap-2 mt-1">
                          {student.open_to_relocate ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                              Yes, willing to relocate
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Prefers current location
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Internship Type */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Internship Preferences</h4>
                      
                      {student.internship_type_preference && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Internship Type</p>
                          <Badge className={`mt-1 ${getInternshipTypeBadgeColor(student.internship_type_preference)} text-white`}>
                            {getInternshipTypeDisplay(student.internship_type_preference)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Certifications ({certifications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {certifications.map((certification: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-200 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{certification.certification_name}</h4>
                        <div className="flex gap-2">
                          {certification.credential_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(certification.credential_url, '_blank')}
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Verify
                            </Button>
                          )}
                          {certification.certificate_file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadCertificate(certification)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {certification.issuing_organization && (
                        <p className="text-gray-600 mb-2">
                          <strong>Issued by:</strong> {certification.issuing_organization}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {certification.issue_date && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Issued: {new Date(certification.issue_date).toLocaleDateString()}
                          </Badge>
                        )}
                        {certification.expiry_date && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Expires: {new Date(certification.expiry_date).toLocaleDateString()}
                          </Badge>
                        )}
                        {certification.credential_id && (
                          <Badge variant="secondary" className="text-xs">
                            ID: {certification.credential_id}
                          </Badge>
                        )}
                        {certification.certificate_file_url && (
                          <Badge variant="default" className="text-xs bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            Certificate Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Projects ({student.projects?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {student.projects?.map((project: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                      <div className="flex gap-2">
                        {project.demo_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(project.demo_url, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Demo
                          </Button>
                        )}
                        {project.video_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWatchVideo(project.video_url, project.title)}
                            className="flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            Video
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.video_url && (
                        <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600 flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video Available
                        </Badge>
                      )}
                      {project.demo_url && (
                        <Badge variant="default" className="text-xs bg-purple-500 hover:bg-purple-600 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Live Demo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {(!student.projects || student.projects.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No projects added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
