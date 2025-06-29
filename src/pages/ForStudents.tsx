
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Code, Briefcase, TrendingUp, ArrowRight, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const ForStudents = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Land Your Dream Internship with 
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Your Projects</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Skip the GPA competition. Show companies what you can actually build and get hired 
            for your coding skills, not your grades.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
          >
            Start Building Your Portfolio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Students Choose InternStack</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Skills Over Grades</h3>
                  <p className="text-gray-600">Get recognized for what you can build, not just your academic performance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Direct Company Access</h3>
                  <p className="text-gray-600">Connect directly with hiring managers who value practical experience.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Project-Based Matching</h3>
                  <p className="text-gray-600">Get matched with roles that align with your project experience and interests.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">No University Bias</h3>
                  <p className="text-gray-600">Your talent matters more than your university ranking or location.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900">500+</h3>
                <p className="text-gray-600">Student Projects</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Briefcase className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900">200+</h3>
                <p className="text-gray-600">Internships Matched</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900">85%</h3>
                <p className="text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-gray-900">4.8/5</h3>
                <p className="text-gray-600">Student Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What to Include Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Makes a Great Student Profile</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-blue-600" />
                  Coding Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 mb-4">Showcase your best work with detailed project descriptions:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Web applications and mobile apps</li>
                  <li>• Open source contributions</li>
                  <li>• Personal coding challenges</li>
                  <li>• Hackathon projects</li>
                  <li>• Course assignments (impressive ones)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-teal-600" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 mb-4">List your programming languages and technologies:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Programming languages (Python, Java, etc.)</li>
                  <li>• Frameworks (React, Django, etc.)</li>
                  <li>• Databases (SQL, MongoDB, etc.)</li>
                  <li>• Tools (Git, Docker, etc.)</li>
                  <li>• Cloud platforms (AWS, Azure, etc.)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                  Professional Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 mb-4">Connect your online presence and portfolio:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• GitHub profile with active repositories</li>
                  <li>• LinkedIn professional profile</li>
                  <li>• Personal portfolio website</li>
                  <li>• Live project demos</li>
                  <li>• Technical blog or articles</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Student Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Alex Chen</h3>
                    <p className="text-gray-600 text-sm">Computer Science Student</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "I was struggling to get interviews with my 3.2 GPA. But after showcasing my React projects 
                  on InternStack, I got 5 interview calls in 2 weeks and landed my dream internship at a fintech startup!"
                </p>
                <div className="text-sm text-blue-600 font-semibold">
                  Now: Software Engineering Intern at FinTech Co.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sarah Rodriguez</h3>
                    <p className="text-gray-600 text-sm">Self-Taught Developer</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Without a CS degree, I thought I had no chance. InternStack let me show my portfolio of 
                  full-stack projects. Companies contacted me directly, and I'm now working at an amazing startup!"
                </p>
                <div className="text-sm text-teal-600 font-semibold">
                  Now: Full-Stack Developer Intern at TechStartup
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Showcase Your Coding Skills?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join hundreds of students who've landed their dream internships through project-based hiring.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Create Your Profile Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForStudents;
