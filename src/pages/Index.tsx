
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

        {/* How InternStack Works - Steps */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How InternStack Works</h2>
            <p className="text-xl text-gray-600">Simple steps to connect talent with opportunity</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Step 1 */}
              <div className="flex items-center mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Upload className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Students Upload Profiles</h3>
                  </div>
                  <p className="text-gray-600">
                    Create comprehensive profiles showcasing skills, projects, and resumes to stand out to recruiters.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center mb-12">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Search className="h-6 w-6 text-teal-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Recruiters Discover Talent</h3>
                  </div>
                  <p className="text-gray-600">
                    Browse and filter through talented students, download resumes, and find the perfect fit for your team.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Star className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Make Connections</h3>
                  </div>
                  <p className="text-gray-600">
                    Direct communication between students and recruiters leads to meaningful internship opportunities.
                  </p>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-8 top-20 bottom-20 w-0.5 bg-gradient-to-b from-blue-600 via-teal-600 to-purple-600 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
