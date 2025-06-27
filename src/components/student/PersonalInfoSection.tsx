
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Globe, Github, Linkedin } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface PersonalInfoSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  graduationYearOptions: string[];
}

const PersonalInfoSection = ({ formData, setFormData, graduationYearOptions }: PersonalInfoSectionProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, parentheses, and dashes
    const inputValue = e.target.value;
    const cleanedValue = inputValue.replace(/[^0-9\s()-]/g, '');
    
    // Prevent input if it contains any non-allowed characters
    if (cleanedValue !== inputValue) {
      // If the cleaned value is different, it means there were invalid characters
      return;
    }
    
    setFormData({...formData, phone: cleanedValue});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              onKeyPress={(e) => {
                // Prevent typing non-numeric characters
                if (!/[0-9\s()-]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                  e.preventDefault();
                }
              }}
              placeholder="(555) 123-4567"
              pattern="[0-9\s()-]*"
              inputMode="numeric"
            />
          </div>
          <div>
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => setFormData({...formData, university: e.target.value})}
              placeholder="Your University"
            />
          </div>
          <div>
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              value={formData.major}
              onChange={(e) => setFormData({...formData, major: e.target.value})}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Select
              value={formData.graduation_year}
              onValueChange={(value) => setFormData({...formData, graduation_year: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select graduation year" />
              </SelectTrigger>
              <SelectContent>
                {graduationYearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <LocationAutocomplete
              value={formData.location}
              onChange={(value) => setFormData({...formData, location: value})}
              placeholder="Enter your location..."
              label="Location"
            />
          </div>
        </div>
        
        {/* Social Links Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-6">
            <Globe className="h-5 w-5" />
            Social Links & Portfolio
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Profile
              </Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="website_url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Personal Website/Portfolio
              </Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            placeholder="Tell us about yourself, your interests, and career goals..."
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
