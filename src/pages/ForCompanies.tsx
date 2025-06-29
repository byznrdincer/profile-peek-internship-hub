
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Search, TrendingUp, ArrowRight, CheckCircle, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const ForCompanies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hire Talented Engineers Based on 
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Real Skills</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stop screening resumes. Start reviewing actual projects. Find engineering students who can 
            contribute from day one with our project-based talent discovery platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
          >
            Find Engineering Talent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Problems We Solve */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">The Problems We Solve</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-red-600">Traditional Hiring Problems:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Hundreds of identical resumes with no real differentiation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Students with high GPAs but no practical hands-on experience</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Time-consuming technical screening processes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-600">Missing out on talented engineers from non-target schools</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-600">InternStack Solutions:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-600">Review actual projects and work before interviewing</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-600">Find students with proven hands-on technical skills</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-600">Skip initial technical screens - see their work directly</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-gray-600">Discover hidden gems from any university or background</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Powerful Hiring Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-6 w-6 text-blue-600" />
                  Smart Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Search by technical skills and tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Filter by project types and complexity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Location and availability preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Engineering discipline matching
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-teal-600" />
                  Project Portfolio Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    View live project demos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Browse project repositories
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    See project descriptions and impact
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Evaluate technical quality and approach
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                  Direct Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Contact students directly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Skip traditional application processes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Faster hiring decisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Build relationships with top talent
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900">75%</h3>
              <p className="text-gray-600">Faster Hiring Process</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900">500+</h3>
              <p className="text-gray-600">Skilled Engineers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900">100+</h3>
              <p className="text-gray-600">Partner Companies</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-3xl text-gray-900">90%</h3>
              <p className="text-gray-600">Hire Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Company Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Perfect for All Company Sizes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Startups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find versatile engineers who can wear multiple hats and contribute 
                  to your product from day one.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <CardTitle>Scale-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Scale your engineering team with talented interns who can grow 
                  into full-time contributors.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Enterprises</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build your future talent pipeline with skilled students who 
                  understand modern engineering practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Hiring Based on Real Skills</h2>
          <p className="text-lg mb-6 opacity-90">
            Join forward-thinking companies already discovering top talent through project-based hiring.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Find Your Next Intern
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForCompanies;
