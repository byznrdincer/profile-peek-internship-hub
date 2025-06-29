import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Upload, Search, Star, ArrowRight, Code, TrendingUp, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile, loading } = useAuth();

  const handleDashboardNavigation = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (profile?.role === 'student') {
      navigate('/student-dashboard');
    } else if (profile?.role === 'recruiter') {
      navigate('/recruiter-dashboard');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            {isAuthenticated && profile?.role === 'recruiter' ? (
              <>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Find Top Talent,
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Build Great Teams</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Discover skilled students ready to make an impact. Browse profiles, view projects, 
                  and connect with the next generation of talent for your team.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Showcase Your Talent, 
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Get Hired</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  We hire based on <strong>what you can build</strong>, not just your GPA or university. 
                  Upload your projects, demonstrate your skills, and get discovered by companies looking for 
                  <span className="text-blue-600 font-semibold"> real talent</span>. Your code speaks louder than your grades.
                </p>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleDashboardNavigation}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
                >
                  {profile?.role === 'student' ? 'Go to Dashboard' : profile?.role === 'recruiter' ? 'Find Talent' : 'Go to Dashboard'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
                >
                  Start Building Your Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* How lazyIntern Works - Steps */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How lazyIntern Works</h2>
            <p className="text-xl text-gray-600">Where talent meets opportunity - no bias, just skills</p>
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
                    <h3 className="text-xl font-semibold text-gray-900">Upload Your Projects & Skills</h3>
                  </div>
                  <p className="text-gray-600">
                    Show what you've built! Upload your coding projects, describe your technical skills, 
                    and let your work demonstrate your capabilities. No need for perfect grades - we care about talent.
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
                    <h3 className="text-xl font-semibold text-gray-900">Companies Discover Real Talent</h3>
                  </div>
                  <p className="text-gray-600">
                    Smart recruiters search by actual skills and project technologies, not just university rankings. 
                    They find students who can deliver results, regardless of academic background.
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
                    <h3 className="text-xl font-semibold text-gray-900">Get Hired for Your Skills</h3>
                  </div>
                  <p className="text-gray-600">
                    Land internships and jobs based on what you can actually do. Companies connect directly 
                    with talented developers who have proven their abilities through real projects.
                  </p>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-8 top-20 bottom-20 w-0.5 bg-gradient-to-b from-blue-600 via-teal-600 to-purple-600 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Why Choose lazyIntern Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose lazyIntern?</h2>
              <p className="text-xl text-gray-600">The future of student hiring is skill-based, not grade-based</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Project-Based Hiring</h3>
                  <p className="text-gray-600">Review actual code and projects, not just grades</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No University Bias</h3>
                  <p className="text-gray-600">Talent is everywhere, we help you find it</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Faster Hiring</h3>
                  <p className="text-gray-600">Skip lengthy screenings, see skills directly</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h3>
                  <p className="text-gray-600">90% of our matches lead to successful hires</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about skill-based student hiring</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How is lazyIntern different from traditional job boards?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Unlike traditional job boards that focus on resumes and GPAs, lazyIntern showcases actual 
                  student projects and coding skills. Companies can see what candidates have built before 
                  even scheduling an interview.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do students need high GPAs to be successful on lazyIntern?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Not at all! We believe coding ability and project experience matter more than grades. 
                  Many successful matches on our platform are students who might not have perfect GPAs 
                  but have impressive portfolios of real projects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What types of companies use lazyIntern?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We work with startups, scale-ups, and enterprises across all industries. From fintech 
                  startups to established tech companies, any organization looking for skilled developers 
                  can benefit from our project-based hiring approach.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do you ensure the quality of student profiles?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We encourage students to showcase their best work with detailed project descriptions, 
                  live demos, and GitHub repositories. This allows companies to thoroughly evaluate 
                  technical skills and coding quality before making contact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
