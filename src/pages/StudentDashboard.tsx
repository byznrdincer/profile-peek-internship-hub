import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ModeToggle } from '@/components/ModeToggle';
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import FileUploader from '@/components/FileUploader';
import { Badge } from "@/components/ui/badge"

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    graduation_year: new Date().getFullYear().toString(),
    bio: '',
    skills: [] as string[],
    github_url: '',
    linkedin_url: '',
    website_url: '',
    availability_status: 'Available',
    preferred_location: '',
    salary_expectation: '',
    internship_type_preference: 'paid',
    stipend_expectation: '',
    resume_url: '',
    resume_filename: '',
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }

        if (data) {
          // Handle the case where some fields might not exist in the database yet
          const email = user.email || '';
          setFormData({
            name: data.name || '',
            email: email,
            phone: data.phone || '',
            university: data.university || '',
            major: data.major || '',
            graduation_year: data.graduation_year || new Date().getFullYear().toString(),
            bio: data.bio || '',
            skills: data.skills || [],
            github_url: data.github_url || '',
            linkedin_url: data.linkedin_url || '',
            website_url: data.website_url || '',
            availability_status: 'Available', // Default value since field doesn't exist
            preferred_location: data.location || '', // Use location field instead
            salary_expectation: '', // Default value since field doesn't exist
            internship_type_preference: data.internship_type_preference || 'paid',
            stipend_expectation: data.stipend_expectation || '',
            resume_url: data.resume_url || '',
            resume_filename: data.resume_filename || '',
          });
          setSkillsList(data.skills || []);
          setIsPublic(false); // Default value since field doesn't exist
          setSelectedDate(data.graduation_year ? new Date(data.graduation_year) : undefined);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Fetch failed",
          description: "There was an error fetching your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  useEffect(() => {
    // Calculate profile completion percentage
    let completion = 0;
    if (formData.name) completion += 10;
    if (formData.email) completion += 10;
    if (formData.phone) completion += 10;
    if (formData.university) completion += 10;
    if (formData.major) completion += 10;
    if (formData.graduation_year) completion += 10;
    if (formData.bio) completion += 10;
    if (formData.skills && formData.skills.length > 0) completion += 10;
    if (formData.github_url) completion += 5;
    if (formData.linkedin_url) completion += 5;
    if (formData.website_url) completion += 5;
    if (formData.availability_status) completion += 5;
    setProfileCompletion(completion);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('student_profiles')
        .upsert({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          university: formData.university,
          major: formData.major,
          graduation_year: formData.graduation_year,
          bio: formData.bio,
          skills: skillsList,
          github_url: formData.github_url,
          linkedin_url: formData.linkedin_url,
          website_url: formData.website_url,
          internship_type_preference: formData.internship_type_preference,
          resume_url: formData.resume_url,
          resume_filename: formData.resume_filename,
          location: formData.preferred_location, // Map to existing location field
          stipend_expectation: formData.stipend_expectation,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your profile has been saved.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = () => {
    if (skillsInput.trim() !== '') {
      setSkillsList([...skillsList, skillsInput.trim()]);
      setSkillsInput('');
      setFormData({ ...formData, skills: [...skillsList, skillsInput.trim()] });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skillsList.filter(skill => skill !== skillToRemove);
    setSkillsList(updatedSkills);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleFileUploaded = (url: string, filename: string) => {
    setFormData({ ...formData, resume_url: url, resume_filename: filename });
  };

  const validateUrl = (url: string, platform: string) => {
    if (!url) return true; // Empty is allowed
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      switch (platform) {
        case 'github':
          return hostname === 'github.com' || hostname === 'www.github.com';
        case 'linkedin':
          return hostname === 'linkedin.com' || hostname === 'www.linkedin.com';
        case 'website':
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        default:
          return true;
      }
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold text-gray-900">Student Dashboard</h1>
            <Badge variant="outline">
              Profile Completion: {profileCompletion}%
            </Badge>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4 items-center">
            <ModeToggle />
            <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Card className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle className="text-xl">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      pattern="[A-Za-z\s]+"
                      title="Please enter letters and spaces only"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your Email"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, phone: numericValue });
                      }}
                      placeholder="Your Phone"
                      title="Please enter numbers only"
                    />
                  </div>
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="Your University"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      type="text"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Your Major"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="graduation_year">Graduation Year</Label>
                    <Select value={formData.graduation_year} onValueChange={(value) => setFormData({ ...formData, graduation_year: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select graduation year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Add a skill"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                      />
                      <Button type="button" size="sm" onClick={handleAddSkill}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap mt-2">
                      {skillsList.map((skill, index) => (
                        <Badge key={index} className="mr-2 mb-2">
                          {skill}
                          <button
                            type="button"
                            className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            &times;
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub Profile</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                      placeholder="https://github.com/yourusername"
                      pattern="https?://(www\.)?github\.com/.*"
                      title="Please enter a valid GitHub URL (e.g., https://github.com/yourusername)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                      placeholder="https://linkedin.com/in/yourprofile"
                      pattern="https?://(www\.)?linkedin\.com/in/.*"
                      title="Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url">Personal Website/Portfolio</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                      placeholder="https://yourwebsite.com"
                      pattern="https?://.*"
                      title="Please enter a valid website URL (e.g., https://yourwebsite.com)"
                    />
                  </div>
                  <div>
                    <Label>
                      Availability Status
                    </Label>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 gap-3">
                        <Label htmlFor="available" className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="available"
                            name="availability"
                            value="Available"
                            className="h-4 w-4"
                            checked={formData.availability_status === 'Available'}
                            onChange={() => setFormData({ ...formData, availability_status: 'Available' })}
                          />
                          <span>Available</span>
                        </Label>
                        <Label htmlFor="looking" className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="looking"
                            name="availability"
                            value="Looking"
                            className="h-4 w-4"
                            checked={formData.availability_status === 'Looking'}
                            onChange={() => setFormData({ ...formData, availability_status: 'Looking' })}
                          />
                          <span>Looking</span>
                        </Label>
                        <Label htmlFor="not_available" className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="not_available"
                            name="availability"
                            value="Not Available"
                            className="h-4 w-4"
                            checked={formData.availability_status === 'Not Available'}
                            onChange={() => setFormData({ ...formData, availability_status: 'Not Available' })}
                          />
                          <span>Not Available</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="preferred_location">Preferred Location</Label>
                    <Input
                      id="preferred_location"
                      type="text"
                      value={formData.preferred_location}
                      onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                      placeholder="Preferred Location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_expectation">Salary Expectation</Label>
                    <Input
                      id="salary_expectation"
                      type="text"
                      value={formData.salary_expectation}
                      onChange={(e) => setFormData({ ...formData, salary_expectation: e.target.value })}
                      placeholder="Salary Expectation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="internship_type_preference">Internship Type Preference</Label>
                    <Select value={formData.internship_type_preference} onValueChange={(value) => setFormData({ ...formData, internship_type_preference: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select internship type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stipend_expectation">Stipend Expectation</Label>
                    <Input
                      id="stipend_expectation"
                      type="tel"
                      value={formData.stipend_expectation}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, stipend_expectation: numericValue });
                      }}
                      placeholder="Stipend Expectation (numbers only)"
                      title="Please enter numbers only"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resume">Resume</Label>
                    <FileUploader onFileUploaded={(url, filename) => setFormData({ ...formData, resume_url: url, resume_filename: filename })} userId={user.id} initialResumeUrl={formData.resume_url} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="is_public">Public Profile</Label>
                    <Switch
                      id="is_public"
                      checked={isPublic}
                      onCheckedChange={(checked) => setIsPublic(checked)}
                    />
                  </div>
                  <Button disabled={saving} className="w-full bg-blue-500 text-white font-semibold rounded-md py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    {saving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Avatar Card */}
          <Card className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle className="text-xl">Your Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://avatar.vercel.sh/${formData.email}.png`} />
                <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
