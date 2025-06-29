
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Building } from "lucide-react";

interface LoginFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoginForm = ({ loading, setLoading }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ 
    email: "", 
    password: "",
    role: "student" as "student" | "recruiter"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Check user's actual role in the database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          toast({
            title: "Login failed",
            description: "Unable to verify user role. Please try again.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        // Verify that the selected role matches the user's actual role
        if (profileData.role !== loginData.role) {
          toast({
            title: "Invalid login attempt",
            description: `You cannot login as a ${loginData.role}. Your account is registered as a ${profileData.role}.`,
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

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
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default LoginForm;
