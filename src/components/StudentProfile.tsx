
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Mail, MapPin, Calendar, Code, Trophy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentProfileProps {
  student: any;
  onBack: () => void;
}

const StudentProfile = ({ student, onBack }: StudentProfileProps) => {
  const { toast } = useToast();

  const handleDownloadResume = () => {
    toast({
      title: "Resume downloaded",
      description: `${student.name}'s resume has been downloaded`,
    });
  };

  const handleContact = () => {
    toast({
      title: "Contact initiated",
      description: `Opening email to contact ${student.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
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
                        {student.university}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Class of {student.graduationYear}
                      </span>
                    </div>
                    <p className="text-lg text-gray-700 mt-2">{student.major}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {student.profileViews} views
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
                      <strong>Email:</strong> {student.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  {student.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Projects ({student.projects.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {student.projects.map((project: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h4>
                    <p className="text-gray-600 mb-3 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
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
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button
                  onClick={handleContact}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Student
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold">{student.profileViews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Skills Listed</span>
                  <span className="font-semibold">{student.skills.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-semibold">{student.projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Graduation</span>
                  <span className="font-semibold">{student.graduationYear}</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Profiles */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">John Smith</p>
                    <p className="text-xs text-gray-600">Computer Science • Stanford</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">React</Badge>
                      <Badge variant="outline" className="text-xs">Python</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Lisa Wang</p>
                    <p className="text-xs text-gray-600">Data Science • MIT</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Python</Badge>
                      <Badge variant="outline" className="text-xs">ML</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
