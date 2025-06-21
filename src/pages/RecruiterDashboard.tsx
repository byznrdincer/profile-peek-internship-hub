import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Eye, Download, Mail, Calendar, Code, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import StudentProfile from "@/components/StudentProfile";
import SearchableMultiSelect from "@/components/SearchableMultiSelect";

interface StudentData {
  id: string;
  user_id: string;
  name: string;
  university: string;
  major: string;
  graduation_year: string;
  bio: string;
  skills: string[];
  profile_views: number;
  resume_url?: string;
  resume_filename?: string;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
  }>;
}

const RecruiterDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedProjectTechnologies, setSelectedProjectTechnologies] = useState<string[]>([]);
  const [graduationYear, setGraduationYear] = useState("");
  const [major, setMajor] = useState("");
  const [minProjects, setMinProjects] = useState("0");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamically generate available skills from all student profiles
  const availableSkills = Array.from(
    new Set(
      students.flatMap(student => student.skills || [])
    )
  ).filter(Boolean).sort();
  
  // Dynamically generate available project technologies from all student projects
  const availableProjectTechnologies = Array.from(
    new Set(
      students.flatMap(student => 
        student.projects.flatMap(project => project.technologies || [])
      )
    )
  ).filter(Boolean).sort();

  const graduationYears = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const { data: studentsData, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          student_projects (
            id,
            title,
            description,
            technologies
          )
        `);

      if (error) throw error;

      const formattedStudents: StudentData[] = studentsData?.map(student => ({
        id: student.id,
        user_id: student.user_id,
        name: student.name || 'Anonymous Student',
        university: student.university || 'Not specified',
        major: student.major || 'Not specified',
        graduation_year: student.graduation_year || 'Not specified',
        bio: student.bio || 'No bio available',
        skills: student.skills || [],
        profile_views: student.profile_views || 0,
        resume_url: student.resume_url,
        resume_filename: student.resume_filename,
        projects: student.student_projects || []
      })) || [];

      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error loading students",
        description: "There was an error loading student profiles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleProjectTechnologyFilter = (tech: string) => {
    if (selectedProjectTechnologies.includes(tech)) {
      setSelectedProjectTechnologies(selectedProjectTechnologies.filter(t => t !== tech));
    } else {
      setSelectedProjectTechnologies([...selectedProjectTechnologies, tech]);
    }
  };

  const applyFilters = () => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSkills = selectedSkills.length === 0 || 
                           selectedSkills.some(skill => student.skills.includes(skill));
      
      const matchesYear = !graduationYear || student.graduation_year === graduationYear;
      
      const matchesMajor = !major || student.major.toLowerCase().includes(major.toLowerCase());
      
      const minProjectsNum = parseInt(minProjects) || 0;
      const matchesProjectCount = student.projects.length >= minProjectsNum;
      
      const matchesProjectSearch = !projectSearchTerm || 
                                  student.projects.some(project => 
                                    project.title.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                                    project.description.toLowerCase().includes(projectSearchTerm.toLowerCase())
                                  );
      
      const matchesProjectTechnologies = selectedProjectTechnologies.length === 0 ||
                                        student.projects.some(project =>
                                          selectedProjectTechnologies.some(tech =>
                                            project.technologies?.includes(tech)
                                          )
                                        );
      
      return matchesSearch && matchesSkills && matchesYear && matchesMajor && 
             matchesProjectCount && matchesProjectSearch && matchesProjectTechnologies;
    });
    
    setFilteredStudents(filtered);
    toast({
      title: "Filters applied",
      description: `Found ${filtered.length} matching profiles`,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setProjectSearchTerm("");
    setSelectedSkills([]);
    setSelectedProjectTechnologies([]);
    setGraduationYear("");
    setMajor("");
    setMinProjects("0");
    setFilteredStudents(students);
    toast({
      title: "Filters cleared",
      description: "All filters have been reset",
    });
  };

  const viewProfile = async (student: StudentData) => {
    setSelectedStudent(student);
    
    try {
      // Increment profile view
      await supabase.rpc('increment_profile_view', {
        student_user_id: student.user_id
      });
      
      toast({
        title: "Profile viewed",
        description: `${student.name} has been notified that you viewed their profile`,
      });
    } catch (error) {
      console.error('Error recording profile view:', error);
    }
  };

  const downloadResume = async (student: StudentData) => {
    if (!student.resume_url) {
      toast({
        title: "No resume available",
        description: `${student.name} hasn't uploaded a resume yet.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const fileName = `${student.user_id}/resume.${student.resume_url.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = student.resume_filename || 'resume';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume downloaded",
        description: `${student.name}'s resume has been downloaded`,
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the resume.",
        variant: "destructive",
      });
    }
  };

  const contactStudent = (student: StudentData) => {
    // Get student email from profiles table
    const mailto = `mailto:?subject=Internship Opportunity&body=Hi ${student.name},%0D%0A%0D%0AI found your profile on InternStack and would like to discuss potential internship opportunities.%0D%0A%0D%0ABest regards`;
    window.open(mailto);
    
    toast({
      title: "Contact initiated",
      description: `Opening email to contact ${student.name}`,
    });
  };

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-xl text-gray-600">Discover talented students and find your next great hire</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Profiles</CardTitle>
              <Users className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Filtered Results</CardTitle>
              <Filter className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredStudents.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredStudents.reduce((sum, student) => sum + student.projects.length, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">With Resumes</CardTitle>
              <Mail className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.filter(s => s.resume_url).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Smart Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Search and Actions */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search students</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or skills..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="self-end flex gap-2">
                <Button onClick={applyFilters} className="bg-gradient-to-r from-teal-500 to-blue-500">
                  Apply Filters
                </Button>
                <Button onClick={clearFilters} variant="outline">
                  Clear All
                </Button>
              </div>
            </div>

            {/* Project-specific filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-search">Search in Projects</Label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="project-search"
                    value={projectSearchTerm}
                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                    placeholder="Search project titles and descriptions..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="min-projects">Minimum Projects</Label>
                <Input
                  id="min-projects"
                  type="number"
                  value={minProjects}
                  onChange={(e) => setMinProjects(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Student profile filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Computer Science, Data Science..."
                />
              </div>
              <div>
                <Label htmlFor="graduation">Graduation Year</Label>
                <Select value={graduationYear} onValueChange={setGraduationYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduationYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enhanced Skills and Technologies filters */}
            <div className="grid md:grid-cols-2 gap-6">
              <SearchableMultiSelect
                options={availableSkills}
                selected={selectedSkills}
                onSelectionChange={setSelectedSkills}
                placeholder="Select student skills..."
                label="Filter by Student Skills"
              />
              
              <SearchableMultiSelect
                options={availableProjectTechnologies}
                selected={selectedProjectTechnologies}
                onSelectionChange={setSelectedProjectTechnologies}
                placeholder="Select project technologies..."
                label="Filter by Project Technologies"
              />
            </div>
          </CardContent>
        </Card>

        {/* Student Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-blue-600">{student.name}</CardTitle>
                    <p className="text-gray-600">{student.major} • {student.graduation_year}</p>
                    <p className="text-sm text-gray-500">{student.university}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {student.profile_views}
                    </Badge>
                    {student.resume_url && (
                      <Badge variant="outline" className="text-xs">
                        Resume
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">{student.bio}</p>
                
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {student.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    Projects: {student.projects.length}
                  </p>
                  {student.projects.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {student.projects.slice(0, 2).map(project => project.title).join(", ")}
                      {student.projects.length > 2 && "..."}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => viewProfile(student)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => downloadResume(student)}
                    disabled={!student.resume_url}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => contactStudent(student)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
