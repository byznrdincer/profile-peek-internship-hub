
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Eye, Download, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import StudentProfile from "@/components/StudentProfile";

const RecruiterDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [graduationYear, setGraduationYear] = useState("");
  const [major, setMajor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Mock student data
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      university: "MIT",
      major: "Computer Science",
      graduationYear: "2024",
      bio: "Passionate full-stack developer with experience in React and Node.js. Love solving complex problems and building user-friendly applications.",
      skills: ["React", "Node.js", "Python", "MongoDB", "TypeScript"],
      projects: [
        {
          title: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented user authentication, payment processing, and inventory management.",
          tech: ["React", "Node.js", "MongoDB", "Stripe"]
        },
        {
          title: "Weather App",
          description: "Created a responsive weather application using React and OpenWeather API. Features include location-based weather, 5-day forecast, and favorite locations.",
          tech: ["React", "API Integration", "CSS3"]
        }
      ],
      profileViews: 15,
      lastViewed: null
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@email.com",
      university: "Stanford",
      major: "Data Science",
      graduationYear: "2025",
      bio: "Data science enthusiast with strong background in machine learning and statistical analysis. Experienced in Python, R, and various ML frameworks.",
      skills: ["Python", "Machine Learning", "TensorFlow", "R", "SQL", "Pandas"],
      projects: [
        {
          title: "Movie Recommendation System",
          description: "Developed a collaborative filtering recommendation system using Python and scikit-learn. Achieved 85% accuracy in predicting user preferences.",
          tech: ["Python", "scikit-learn", "Pandas", "NumPy"]
        }
      ],
      profileViews: 8,
      lastViewed: null
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@email.com",
      university: "UC Berkeley",
      major: "Computer Science",
      graduationYear: "2024",
      bio: "Frontend developer with a passion for creating beautiful, accessible user interfaces. Strong background in React, Vue.js, and modern CSS frameworks.",
      skills: ["React", "Vue.js", "CSS3", "JavaScript", "Figma", "Tailwind CSS"],
      projects: [
        {
          title: "Design System Library",
          description: "Created a comprehensive design system library with React components, used across multiple projects. Includes accessibility features and comprehensive documentation.",
          tech: ["React", "Storybook", "CSS3", "Accessibility"]
        }
      ],
      profileViews: 22,
      lastViewed: null
    }
  ];

  const [filteredStudents, setFilteredStudents] = useState(students);

  const availableSkills = ["React", "Node.js", "Python", "JavaScript", "TypeScript", "MongoDB", "SQL", "Machine Learning", "TensorFlow", "Vue.js", "CSS3", "Tailwind CSS", "Figma", "R", "Pandas"];

  const handleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const applyFilters = () => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSkills = selectedSkills.length === 0 || 
                           selectedSkills.some(skill => student.skills.includes(skill));
      
      const matchesYear = !graduationYear || student.graduationYear === graduationYear;
      
      const matchesMajor = !major || student.major.toLowerCase().includes(major.toLowerCase());
      
      return matchesSearch && matchesSkills && matchesYear && matchesMajor;
    });
    
    setFilteredStudents(filtered);
    toast({
      title: "Filters applied",
      description: `Found ${filtered.length} matching profiles`,
    });
  };

  const viewProfile = (student: any) => {
    setSelectedStudent(student);
    // Simulate profile view notification
    toast({
      title: "Profile viewed",
      description: `${student.name} has been notified that you viewed their profile`,
    });
  };

  const downloadResume = (studentName: string) => {
    toast({
      title: "Resume downloaded",
      description: `${studentName}'s resume has been downloaded`,
    });
  };

  const contactStudent = (student: any) => {
    toast({
      title: "Contact initiated",
      description: `Opening email to contact ${student.name}`,
    });
  };

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-xl text-gray-600">Discover talented students and find your next great hire</p>
        </div>

        {/* Stats */}
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
              <CardTitle className="text-sm font-medium opacity-90">Profiles Viewed</CardTitle>
              <Eye className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Contacted</CardTitle>
              <Mail className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
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
              <div className="self-end">
                <Button onClick={applyFilters} className="bg-gradient-to-r from-teal-500 to-blue-500">
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Additional Filters */}
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
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <Label>Filter by Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSkillFilter(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Profiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-blue-600">{student.name}</CardTitle>
                    <p className="text-gray-600">{student.major} • {student.graduationYear}</p>
                    <p className="text-sm text-gray-500">{student.university}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {student.profileViews}
                  </Badge>
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
                  <p className="text-sm font-semibold text-gray-700 mb-1">Projects: {student.projects.length}</p>
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
                    onClick={() => downloadResume(student.name)}
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

        {filteredStudents.length === 0 && (
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
