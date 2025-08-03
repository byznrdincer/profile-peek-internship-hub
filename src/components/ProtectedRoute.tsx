import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "student" | "recruiter";
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/auth");
        return;
      }

      if (requireRole && profile?.role && profile.role !== requireRole) {
        navigate("/");
        return;
      }

      setChecked(true); // tüm kontroller tamamlandı
    }
  }, [isAuthenticated, profile, loading, requireRole, navigate]);

  // Henüz kontrol tamamlanmadıysa loading göster
  if (loading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
