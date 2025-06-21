import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, X, User, FileText, Code, Trophy, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [projects, setProjects] = useState<Array<{id?: string, title: string, description: string, technologies: string[]}>>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    university: "",
    major: "",
    graduation_year: "",
    bio: "",
  });

  // Load existing profile data
  useEffect(() => {
    if (user) {
      loadProfile();
      loadProjects();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        university: profile.university || "",
        major: profile.major || "",
        graduation_year: profile.graduation_year || "",
        bio: profile.bio || "",
      });
      setSkills(profile.skills || []);
      setProfileViews(profile.profile_views || 0);
      setExistingResumeUrl(profile.resume_url);
    }
  };

  const loadProjects = async () => {
    if (!user) return;

    const { data: studentProfile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (studentProfile) {
      const { data: projectsData, error } = await supabase
        .from('student_projects')
        .select('*')
        .eq('student_id', studentProfile.id);

      if (!error && projectsData) {
        setProjects(projectsData.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          technologies: p.technologies || []
        })));
      }
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: [] }]);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    if (field === 'technologies') {
      updated[index][field] = value.split(',').map(t => t.trim());
    } else {
      updated[index][field] = value;
    }
    setProjects(updated);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
      toast({
        title: "Resume selected",
        description: `${file.name} is ready to upload.`,
      });
    }
  };

  const uploadResume = async () => {
    if (!resumeFile || !user) {
      toast({
        title: "Upload failed",
        description: "Please select a file first.",
        variant: "destructive",
      });
      return;
    }

    setUploadingResume(true);
    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${user.id}/resume_${Date.now()}.${fileExt}`;

      console.log('Uploading file:', fileName);

      // First, delete existing resume if any
      if (existingResumeUrl) {
        const oldFileName = existingResumeUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('resumes')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, { 
          upsert: false,
          contentType: resumeFile.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Update profile with resume info
      const { error: updateError } = await supabase
        .from('student_profiles')
        .upsert({ 
          user_id: user.id,
          resume_url: publicUrl,
          resume_filename: resumeFile.name,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      setExistingResumeUrl(publicUrl);
      setResumeFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been uploaded and is now visible to recruiters.",
      });
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const downloadResume = async () => {
    if (!existingResumeUrl || !user) return;

    try {
      // Extract the file path from the URL
      const urlParts = existingResumeUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;
      
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
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your resume.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('student_profiles')
        .upsert({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          university: formData.university,
          major: formData.major,
          graduation_year: formData.graduation_year,
          bio: formData.bio,
          skills: skills,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Get student profile ID for projects
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (studentProfile) {
        // Delete existing projects
        await supabase
          .from('student_projects')
          .delete()
          .eq('student_id', studentProfile.id);

        // Insert new projects
        if (projects.length > 0) {
          const projectsToInsert = projects
            .filter(p => p.title.trim())
            .map(project => ({
              student_id: studentProfile.id,
              title: project.title,
              description: project.description,
              technologies: project.technologies
            }));

          if (projectsToInsert.length > 0) {
            const { error: projectsError } = await supabase
              .from('student_projects')
              .insert(projectsToInsert);

            if (projectsError) throw projectsError;
          }
        }
      }

      toast({
        title: "Profile saved successfully!",
        description: "Your profile is now visible to recruiters.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-xl text-gray-600">Build your profile and get discovered by top recruiters</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <div className="text-2xl font-bold">{skills.length}</div>
              <p className="text-xs opacity-90">Keep adding more!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Projects</CardTitle>
              <Trophy className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs opacity-90">Showcase your work</p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    placeholder="Your University"
                  />
                </div>
                <div>
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                    placeholder="2024"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself, your interests, and career goals..."
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingResumeUrl && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700">Resume uploaded successfully</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadResume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {resumeFile ? resumeFile.name : "Upload your resume (PDF, DOC, DOCX)"}
                </p>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <div className="flex gap-2 justify-center">
                    <Label htmlFor="resume-upload">
                      <Button type="button" variant="outline" className="cursor-pointer">
                        Choose File
                      </Button>
                    </Label>
                    {resumeFile && (
                      <Button
                        type="button"
                        onClick={uploadResume}
                        disabled={uploadingResume}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {uploadingResume ? "Uploading..." : "Upload Resume"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Projects
              </CardTitle>
              <Button type="button" onClick={addProject} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">Project {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeProject(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Project Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        placeholder="My Awesome Project"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Describe your project, what it does, and your role..."
                        className="min-h-20"
                      />
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects added yet. Click "Add Project" to showcase your work!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
