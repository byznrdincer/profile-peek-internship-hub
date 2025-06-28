import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    phone: string;
    email: string;
    university: string;
    major: string;
    graduation_year: string;
    bio: string;
    location: string;
    github_url: string;
    website_url: string;
    linkedin_url: string;
    internship_type_preference: string;
    preferred_internship_location: string;
    preferred_locations: string[];
    open_to_relocate: boolean;
    multiple_website_urls: string[];
  };
  setFormData: (data: any) => void;
  graduationYearOptions: string[];
}

const PersonalInfoSection = ({ formData, setFormData, graduationYearOptions }: PersonalInfoSectionProps) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const addWebsiteUrl = () => {
    setFormData((prev: any) => ({
      ...prev,
      multiple_website_urls: [...prev.multiple_website_urls, ""]
    }));
  };

  const updateWebsiteUrl = (index: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      multiple_website_urls: prev.multiple_website_urls.map((url: string, i: number) => 
        i === index ? value : url
      )
    }));
  };

  const removeWebsiteUrl = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      multiple_website_urls: prev.multiple_website_urls.filter((_: string, i: number) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            This email will be used by recruiters to contact you directly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="university">University *</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              placeholder="Enter your university name"
              required
            />
          </div>
          <div>
            <Label htmlFor="major">Major/Field of Study *</Label>
            <Input
              id="major"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              placeholder="e.g., Computer Science, Mechanical Engineering"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="graduation_year">Graduation Year *</Label>
            <Select 
              value={formData.graduation_year} 
              onValueChange={(value) => handleInputChange('graduation_year', value)}
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
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State/Country"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio/About Me</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell recruiters about yourself, your interests, and career goals..."
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
          </div>
          
          {/* Multiple Website URLs Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Website/Portfolio URLs</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addWebsiteUrl}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Website
              </Button>
            </div>
            
            {formData.multiple_website_urls.length === 0 && (
              <div className="text-sm text-gray-500 italic mb-4">
                No website URLs added yet. Click "Add Website" to add your portfolio, personal websites, or other relevant links.
              </div>
            )}
            
            <div className="space-y-2">
              {formData.multiple_website_urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateWebsiteUrl(index, e.target.value)}
                    placeholder={`Website URL ${index + 1} (e.g., https://yourportfolio.com)`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeWebsiteUrl(index)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Keep backward compatibility with single website_url field */}
          <div>
            <Label htmlFor="website_url">Legacy Website URL (for backward compatibility)</Label>
            <Input
              id="website_url"
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              This field is kept for backward compatibility. Use the "Website/Portfolio URLs" section above for multiple links.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
