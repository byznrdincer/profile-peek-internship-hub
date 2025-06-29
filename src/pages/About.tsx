
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">lazyIntern</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing how companies discover and hire student talent by focusing on 
            skills and projects rather than grades and university rankings.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To bridge the gap between talented students and forward-thinking companies 
                by creating a platform where skills matter more than credentials.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-teal-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A world where every talented student has the opportunity to showcase their 
                abilities and land their dream internship, regardless of their academic background.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Our Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Connecting hundreds of talented students with companies that value 
                practical skills and real-world project experience over traditional metrics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Started lazyIntern</h2>
          <div className="text-lg text-gray-600 space-y-4">
            <p>
              Too many brilliant students with incredible coding skills and innovative projects 
              were being overlooked simply because they didn't attend top-tier universities or 
              maintain perfect GPAs.
            </p>
            <p>
              Meanwhile, companies were struggling to find genuinely talented developers who 
              could contribute from day one. The traditional hiring process was failing both sides.
            </p>
            <p>
              lazyIntern was born from the belief that <strong>what you can build matters more 
              than where you studied</strong>. We created a platform where students can showcase 
              their real projects and companies can discover talent based on actual skills.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Join the Skill-Based Hiring Revolution</h2>
          <p className="text-lg mb-6 opacity-90">
            Whether you're a student ready to showcase your projects or a company looking for real talent, 
            lazyIntern is your platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
