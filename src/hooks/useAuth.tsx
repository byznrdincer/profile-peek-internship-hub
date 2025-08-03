import { useState } from "react";

interface UserProfile {
  id: string;
  role: "student" | "recruiter";
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async (userData: UserProfile) => {
    setUser(userData); // ✅ kullanıcıyı kaydet
    setLoading(true);

    try {
      const endpoint =
        userData.role === "student"
          ? `http://127.0.0.1:8000/api/student/profile/${userData.id}/`
          : `http://127.0.0.1:8000/api/recruiter/profile/me/`;

      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const profileData = await response.json();
        // ✅ profilin içine role da ekleniyor
        setProfile({ ...profileData, role: userData.role });
      } else {
        console.error("Profile fetch failed:", await response.text());
        setProfile(null);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  return {
    user,
    profile,
    isAuthenticated: !!user && !!profile, // ✅ login olmuş ve profili yüklenmişse true
    login,
    logout,
    loading,
  };
};
