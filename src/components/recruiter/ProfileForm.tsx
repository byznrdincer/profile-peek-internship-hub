import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface ProfileFormData {
  name: string;
  phone: string;
  company_name: string;
  position: string;
  location: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onUpdate: (data: ProfileFormData) => void;
  loading?: boolean;
}

const ProfileForm = ({
  initialData,
  onUpdate,
  loading: externalLoading,
}: ProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  const isLoading = loading || externalLoading;

  // initialData değiştiğinde formu güncelle
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Backend URL’ini kendi sunucuna göre ayarla
  const BASE_URL = "/api/recruiter/profile";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "User not found",
        description: "Please login before saving profile.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Profil var mı kontrol et
      const checkRes = await fetch(`${BASE_URL}/${user.id}`, {
        method: "GET",
      });

      let existingProfile = null;
      if (checkRes.ok) {
        existingProfile = await checkRes.json();
      }

      let saveRes;
      if (existingProfile) {
        // Güncelle
        saveRes = await fetch(`${BASE_URL}/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Yeni oluştur
        saveRes = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, user_id: user.id }),
        });
      }

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || "Failed to save profile");
      }

      const savedData = await saveRes.json();

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });

      onUpdate(formData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your Name"
              pattern="[A-Za-z\s]+"
              title="Please enter a valid name (letters and spaces only)"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              type="text"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              placeholder="Your Company"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="text"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="HR Manager, Technical Recruiter, etc."
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, phone: value });
              }}
              placeholder="5551234567"
              pattern="[0-9]*"
              title="Please enter numbers only"
              disabled={isLoading}
            />
          </div>

          <LocationAutocomplete
            value={formData.location}
            onChange={(value) => setFormData({ ...formData, location: value })}
            placeholder="New York, NY, USA"
            label="Location"
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
