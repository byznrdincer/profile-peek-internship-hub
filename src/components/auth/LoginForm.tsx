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
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Building } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoginForm = ({ loading, setLoading }: LoginFormProps) => {
  const { toast } = useToast();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "student" as "student" | "recruiter",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      await login({
        id: data.user_id,
        email: data.email,
        name: data.name,
        role: data.role,
      });

      toast({
        title: `Welcome back, ${data.role}!`,
        description: "You have been logged in successfully.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="login-role">Login as</Label>
        <Select
          value={loginData.role}
          onValueChange={(value: "student" | "recruiter") =>
            setLoginData({ ...loginData, role: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
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
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-teal-500"
        disabled={loading}
      >
        {loading
          ? "Logging in..."
          : `Login as ${loginData.role === "student" ? "Student" : "Recruiter"}`}
      </Button>
    </form>
  );
};

export default LoginForm;
