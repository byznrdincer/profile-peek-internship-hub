import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import OTPVerification from "@/components/auth/OTPVerification";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  useEffect(() => {
    // Kullanıcı zaten login olmuşsa, rolüne göre yönlendir
    const checkUser = async () => {
      try {
        const response = await fetch("/api/auth/user/profile/", {
          method: "GET",
          credentials: "include", // oturum çerezi varsa gönder
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.id && data.role) {
            if (data.role === "student") {
              navigate("/student-dashboard");
            } else if (data.role === "recruiter") {
              navigate("/recruiter-dashboard");
            } else {
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      }
    };
    checkUser();
  }, [navigate]);

  if (showOTPVerification) {
    return (
      <OTPVerification
        otpEmail={otpEmail}
        loading={loading}
        setLoading={setLoading}
        setShowOTPVerification={setShowOTPVerification}
        setOtpEmail={setOtpEmail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AuthHeader />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm loading={loading} setLoading={setLoading} />
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm
                loading={loading}
                setLoading={setLoading}
                setOtpEmail={setOtpEmail}
                setShowOTPVerification={setShowOTPVerification}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
