
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Upload, Search, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect Students with 
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Dream Internships</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              InternUpload bridges the gap between talented students and innovative companies. 
              Showcase your skills, discover opportunities, and launch your career.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {profile?.role === 'student' && (
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/student-dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                {profile?.role === 'recruiter' && (
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/recruiter-dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
                  >
                    Find Talent
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                  className="px-8"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How InternUpload Works</h2>
            <p className="text-xl text-gray-600">Simple steps to connect talent with opportunity</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Students Upload Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create comprehensive profiles showcasing skills, projects, and resumes to stand out to recruiters.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Recruiters Discover Talent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browse and filter through talented students, download resumes, and find the perfect fit for your team.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Make Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Direct communication between students and recruiters leads to meaningful internship opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students and recruiters already using InternUpload
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => navigate('/auth')}
                className="px-8"
              >
                <Users className="mr-2 h-5 w-5" />
                Join as Student
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Join as Recruiter  
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
