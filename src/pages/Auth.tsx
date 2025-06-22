
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, GraduationCap, Building, ArrowLeft } from "lucide-react";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [loginData, setLoginData] = useState({ 
    email: "", 
    password: "",
    role: "student" as "student" | "recruiter"
  });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student" as "student" | "recruiter"
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Welcome back, ${loginData.role}!`,
          description: "You have been logged in successfully.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signupOptions: any = {
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            name: signupData.name,
            role: signupData.role,
          }
        }
      };

      // For students, add email redirect
      if (signupData.role === 'student') {
        signupOptions.options.emailRedirectTo = `${window.location.origin}/`;
      }

      const { error } = await supabase.auth.signUp(signupOptions);

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (signupData.role === 'student') {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        } else {
          // For recruiters, show OTP verification
          setOtpEmail(signupData.email);
          setShowOTPVerification(true);
          toast({
            title: "Verification required",
            description: "Please check your email for a 6-digit verification code.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: otp,
        type: 'signup'
      });

      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account verified!",
          description: "Your recruiter account has been successfully verified. You can now log in.",
        });
        setShowOTPVerification(false);
        setOtpEmail("");
        // Reset signup form
        setSignupData({
          email: "",
          password: "",
          name: "",
          role: "student"
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: otpEmail
      });

      if (error) {
        toast({
          title: "Resend failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error) {
      toast({
        title: "Resend failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                InternStack
              </h1>
            </div>
            <CardTitle>Verify Your Email</CardTitle>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit verification code to {otpEmail}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} onComplete={handleOTPVerification}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={resendOTP}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Resending..." : "Resend Code"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowOTPVerification(false);
                  setOtpEmail("");
                }}
                className="w-full"
              >
                Back to Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              InternStack
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-role">Login as</Label>
                  <Select value={loginData.role} onValueChange={(value: "student" | "recruiter") => setLoginData({ ...loginData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Student Login
                        </div>
                      </SelectItem>
                      <SelectItem value="recruiter">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Recruiter Login
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : `Login as ${loginData.role === 'student' ? 'Student' : 'Recruiter'}`}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={signupData.role} onValueChange={(value: "student" | "recruiter") => setSignupData({ ...signupData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="recruiter">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Recruiter
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                  {signupData.role === 'recruiter' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Company email preferred but not required
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : `Sign Up as ${signupData.role === 'student' ? 'Student' : 'Recruiter'}`}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
