import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Building } from "lucide-react";

interface SignupFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setOtpEmail: (email: string) => void;
  setShowOTPVerification: (show: boolean) => void;
}

const SignupForm = ({
  loading,
  setLoading,
  setOtpEmail,
  setShowOTPVerification,
}: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student" as "student" | "recruiter",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Terms and Conditions required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          name: signupData.name,
          role: signupData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Signup failed",
          description: data.error || "An error occurred.",
          variant: "destructive",
        });
      } else {
        if (signupData.role === "student") {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        } else {
          setOtpEmail(signupData.email);
          setShowOTPVerification(true);
          toast({
            title: "Verification required",
            description:
              "Please check your email for a 6-digit verification code.",
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

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Label htmlFor="role">I am a...</Label>
        <Select
          value={signupData.role}
          onValueChange={(value: "student" | "recruiter") =>
            setSignupData({ ...signupData, role: value })
          }
        >
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
          onChange={(e) =>
            setSignupData({ ...signupData, name: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={signupData.email}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
          }
          placeholder="your@email.com"
          required
        />
        {signupData.role === "recruiter" && (
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
          onChange={(e) =>
            setSignupData({ ...signupData, password: e.target.value })
          }
          required
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) =>
            setAcceptTerms(checked as boolean)
          }
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <button
              type="button"
              onClick={() => navigate("/terms")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Terms and Conditions
            </button>
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500"
        disabled={loading || !acceptTerms}
      >
        {loading
          ? "Creating account..."
          : `Sign Up as ${
              signupData.role === "student" ? "Student" : "Recruiter"
            }`}
      </Button>
    </form>
  );
};

export default SignupForm;
