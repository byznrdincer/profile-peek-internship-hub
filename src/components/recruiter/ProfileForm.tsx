
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

const ProfileForm = ({ initialData, onUpdate, loading: externalLoading }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const isLoading = loading || externalLoading;

  // Update form data when initialData changes
  useEffect(() => {
    console.log('ProfileForm: initialData changed:', initialData);
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found for profile save');
      return;
    }

    console.log('Saving profile data:', formData);
    setLoading(true);
    
    try {
      // First, check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError);
        throw fetchError;
      }

      let result;
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile:', existingProfile.id);
        result = await supabase
          .from('recruiter_profiles')
          .update({
            name: formData.name,
            phone: formData.phone,
            company_name: formData.company_name,
            position: formData.position,
            location: formData.location,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Create new profile
        console.log('Creating new profile for user:', user.id);
        result = await supabase
          .from('recruiter_profiles')
          .insert({
            user_id: user.id,
            name: formData.name,
            phone: formData.phone,
            company_name: formData.company_name,
            position: formData.position,
            location: formData.location
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving profile:', result.error);
        throw result.error;
      }

      console.log('Profile saved successfully:', result.data);
      
      // Call onUpdate with the saved data
      onUpdate(formData);
      
      toast({
        title: "Profile updated successfully!",
        description: "Your recruiter profile has been saved.",
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your profile. Please try again.",
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
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Name"
              pattern="[A-Za-z\s]+"
              title="Please enter a valid name (letters and spaces only)"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
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
              onChange={(e) => setFormData({...formData, position: e.target.value})}
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
                const value = e.target.value.replace(/\D/g, '');
                setFormData({...formData, phone: value});
              }}
              placeholder="5551234567"
              pattern="[0-9]*"
              title="Please enter numbers only"
              disabled={isLoading}
            />
          </div>
          <LocationAutocomplete
            value={formData.location}
            onChange={(value) => setFormData({...formData, location: value})}
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
