import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, X, User, FileText, Code, Trophy, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import SearchableMultiSelect from "@/components/SearchableMultiSelect";

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [projects, setProjects] = useState<Array<{id?: string, title: string, description: string, technologies: string[]}>>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  
  // Comprehensive skills list for auto-suggest (1000+ skills)
  const commonSkills = [
    // Programming Languages
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust", "Swift", "Kotlin", 
    "Scala", "Ruby", "PHP", "Perl", "R", "MATLAB", "Objective-C", "Dart", "Elixir", "Haskell", 
    "Clojure", "F#", "Visual Basic", "COBOL", "Fortran", "Assembly", "Lua", "Julia", "Erlang",
    
    // Web Technologies
    "HTML5", "CSS3", "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js", "Gatsby", 
    "Ember.js", "Backbone.js", "jQuery", "Bootstrap", "Tailwind CSS", "Bulma", "Foundation", 
    "Semantic UI", "Material-UI", "Ant Design", "Chakra UI", "Styled Components", "SASS", "LESS", 
    "Webpack", "Vite", "Parcel", "Rollup", "Babel", "ESLint", "Prettier",
    
    // Backend Frameworks
    "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "Spring Framework", 
    "ASP.NET", "Laravel", "Symfony", "CodeIgniter", "Ruby on Rails", "Sinatra", "Phoenix", 
    "Gin", "Echo", "Fiber", "Actix", "Rocket", "Warp", "Axum",
    
    // Databases
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "MariaDB", 
    "Cassandra", "DynamoDB", "CouchDB", "Neo4j", "InfluxDB", "Firebase Firestore", "Supabase", 
    "PlanetScale", "Cockroach DB", "Amazon RDS", "Azure SQL", "Google Cloud SQL", "Elasticsearch",
    
    // Cloud Platforms
    "AWS", "Azure", "Google Cloud Platform", "DigitalOcean", "Heroku", "Vercel", "Netlify", 
    "Railway", "Render", "Fly.io", "PlanetScale", "Cloudflare", "Linode", "Vultr", "OVH",
    
    // AWS Services
    "EC2", "S3", "Lambda", "RDS", "DynamoDB", "CloudFront", "Route 53", "VPC", "IAM", "CloudFormation", 
    "Elastic Beanstalk", "ECS", "EKS", "API Gateway", "SQS", "SNS", "CloudWatch", "X-Ray",
    
    // Azure Services
    "Azure Functions", "Azure App Service", "Azure SQL Database", "Azure Cosmos DB", "Azure Storage", 
    "Azure Active Directory", "Azure DevOps", "Azure Kubernetes Service", "Azure Container Instances",
    
    // Google Cloud Services
    "Google Compute Engine", "Google App Engine", "Google Cloud Functions", "Google Cloud Storage", 
    "Google Cloud SQL", "BigQuery", "Google Kubernetes Engine", "Cloud Run", "Firebase",
    
    // DevOps & Tools
    "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI", 
    "Azure DevOps", "Terraform", "Ansible", "Chef", "Puppet", "Vagrant", "Packer", "Consul", 
    "Vault", "Prometheus", "Grafana", "ELK Stack", "Splunk", "New Relic", "Datadog",
    
    // Version Control
    "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Mercurial", "Perforce",
    
    // Mobile Development
    "React Native", "Flutter", "Ionic", "Xamarin", "Cordova", "PhoneGap", "NativeScript", 
    "Swift UI", "UIKit", "Android Studio", "Jetpack Compose", "Kotlin Multiplatform",
    
    // Game Development
    "Unity", "Unreal Engine", "Godot", "GameMaker Studio", "Construct", "Cocos2d", "Phaser", 
    "Three.js", "Babylon.js", "A-Frame", "PlayCanvas",
    
    // Data Science & AI/ML
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", 
    "Plotly", "Jupyter", "Apache Spark", "Hadoop", "Tableau", "Power BI", "D3.js", "OpenCV", 
    "Hugging Face", "LangChain", "OpenAI API", "Anthropic Claude", "Stable Diffusion",
    
    // Testing
    "Jest", "Mocha", "Chai", "Jasmine", "Cypress", "Selenium", "Playwright", "Puppeteer", 
    "TestCafe", "WebDriverIO", "JUnit", "TestNG", "pytest", "unittest", "RSpec", "Capybara",
    
    // Design Tools
    "Figma", "Adobe XD", "Sketch", "InVision", "Photoshop", "Illustrator", "After Effects", 
    "Premiere Pro", "Canva", "Framer", "Principle", "ProtoPie", "Zeplin", "Abstract",
    
    // Project Management
    "Jira", "Trello", "Asana", "Monday.com", "ClickUp", "Notion", "Confluence", "Slack", 
    "Microsoft Teams", "Discord", "Zoom", "Linear", "GitHub Projects", "Azure Boards",
    
    // APIs & Integration
    "REST API", "GraphQL", "gRPC", "WebSockets", "Socket.io", "Postman", "Insomnia", "Swagger", 
    "OpenAPI", "Apollo GraphQL", "Prisma", "TypeORM", "Sequelize", "Mongoose", "Drizzle",
    
    // Security
    "OAuth", "JWT", "SAML", "LDAP", "SSL/TLS", "HTTPS", "OWASP", "Penetration Testing", 
    "Vulnerability Assessment", "Encryption", "Hashing", "Digital Signatures", "PKI",
    
    // Operating Systems
    "Linux", "Ubuntu", "CentOS", "Red Hat", "Debian", "macOS", "Windows", "Windows Server", 
    "FreeBSD", "Alpine Linux", "Amazon Linux", "Kali Linux",
    
    // Networking
    "TCP/IP", "HTTP/HTTPS", "DNS", "Load Balancing", "CDN", "VPN", "Firewall", "Proxy", 
    "Nginx", "Apache", "HAProxy", "Cloudflare", "Route 53", "DHCP", "NAT",
    
    // Monitoring & Logging
    "Prometheus", "Grafana", "ELK Stack", "Splunk", "New Relic", "Datadog", "Sentry", 
    "LogRocket", "CloudWatch", "Azure Monitor", "Google Cloud Monitoring",
    
    // E-commerce
    "Shopify", "WooCommerce", "Magento", "BigCommerce", "Stripe", "PayPal", "Square", 
    "Razorpay", "Braintree", "Klarna", "Afterpay",
    
    // CMS
    "WordPress", "Drupal", "Joomla", "Contentful", "Strapi", "Sanity", "Ghost", "Webflow", 
    "Squarespace", "Wix", "Headless CMS", "JAMstack",
    
    // Blockchain
    "Solidity", "Web3.js", "Ethers.js", "Hardhat", "Truffle", "MetaMask", "Ethereum", 
    "Bitcoin", "Smart Contracts", "DeFi", "NFT", "IPFS", "Polygon", "Binance Smart Chain",
    
    // IoT
    "Arduino", "Raspberry Pi", "MQTT", "LoRaWAN", "Zigbee", "Bluetooth", "WiFi", "Sensors", 
    "Edge Computing", "Industrial IoT", "Home Automation",
    
    // DevOps Methodologies
    "Agile", "Scrum", "Kanban", "Lean", "Six Sigma", "DevOps", "GitOps", "CI/CD", 
    "Continuous Integration", "Continuous Deployment", "Infrastructure as Code", "Microservices",
    
    // Soft Skills
    "Leadership", "Team Management", "Communication", "Problem Solving", "Critical Thinking", 
    "Time Management", "Project Management", "Presentation Skills", "Technical Writing", 
    "Mentoring", "Training", "Public Speaking", "Negotiation", "Conflict Resolution",
    
    // Business Skills
    "Business Analysis", "Requirements Gathering", "Stakeholder Management", "Product Management", 
    "Marketing", "Sales", "Customer Service", "Finance", "Accounting", "Legal Compliance",
    
    // Industry Knowledge
    "FinTech", "HealthTech", "EdTech", "E-commerce", "Gaming", "SaaS", "B2B", "B2C", 
    "Enterprise Software", "Startups", "Consulting", "Freelancing",
    
    // Certifications
    "AWS Certified", "Azure Certified", "Google Cloud Certified", "Oracle Certified", 
    "Microsoft Certified", "Cisco Certified", "CompTIA", "PMP", "Scrum Master", "CISSP",
    
    // Additional Technologies
    "Blockchain", "Machine Learning", "Artificial Intelligence", "Computer Vision", "NLP", 
    "Robotics", "Augmented Reality", "Virtual Reality", "3D Modeling", "Animation",
    
    // Languages (Human)
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Russian", 
    "Portuguese", "Italian", "Dutch", "Arabic", "Hindi", "Bengali", "Urdu", "Turkish",
    
    // Specialized Areas
    "Cybersecurity", "Data Analytics", "Business Intelligence", "Digital Marketing", 
    "SEO", "SEM", "Social Media Marketing", "Content Marketing", "Email Marketing", 
    "Affiliate Marketing", "Growth Hacking", "User Experience", "User Interface Design",
    
    // Emerging Technologies
    "Quantum Computing", "Edge AI", "5G", "Autonomous Vehicles", "Drone Technology", 
    "3D Printing", "Nanotechnology", "Biotechnology", "Clean Energy", "Renewable Energy"
  ];
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    university: "",
    major: "",
    graduation_year: "",
    bio: "",
  });

  // Load existing profile data
  useEffect(() => {
    if (user) {
      loadProfile();
      loadProjects();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data: profile, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        university: profile.university || "",
        major: profile.major || "",
        graduation_year: profile.graduation_year || "",
        bio: profile.bio || "",
      });
      setSkills(profile.skills || []);
      setProfileViews(profile.profile_views || 0);
      setExistingResumeUrl(profile.resume_url);
    }
  };

  const loadProjects = async () => {
    if (!user) return;

    const { data: studentProfile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (studentProfile) {
      const { data: projectsData, error } = await supabase
        .from('student_projects')
        .select('*')
        .eq('student_id', studentProfile.id);

      if (!error && projectsData) {
        setProjects(projectsData.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          technologies: p.technologies || []
        })));
      }
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: [] }]);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    if (field === 'technologies') {
      updated[index][field] = value.split(',').map(t => t.trim());
    } else {
      updated[index][field] = value;
    }
    setProjects(updated);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }

      setResumeFile(file);
      toast({
        title: "Resume selected",
        description: `${file.name} is ready to upload.`,
      });
    }
  };

  const uploadResume = async () => {
    if (!resumeFile || !user) {
      toast({
        title: "Upload failed",
        description: "Please select a file first.",
        variant: "destructive",
      });
      return;
    }

    setUploadingResume(true);
    try {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${user.id}/resume_${Date.now()}.${fileExt}`;

      console.log('Uploading file:', fileName);

      // First, delete existing resume if any
      if (existingResumeUrl) {
        const oldFileName = existingResumeUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('resumes')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, { 
          upsert: false,
          contentType: resumeFile.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Update profile with resume info
      const { error: updateError } = await supabase
        .from('student_profiles')
        .upsert({ 
          user_id: user.id,
          resume_url: publicUrl,
          resume_filename: resumeFile.name,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      setExistingResumeUrl(publicUrl);
      setResumeFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been uploaded and is now visible to recruiters.",
      });
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const downloadResume = async () => {
    if (!existingResumeUrl || !user) return;

    try {
      // Extract the file path from the URL
      const urlParts = existingResumeUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your resume.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('student_profiles')
        .upsert({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          university: formData.university,
          major: formData.major,
          graduation_year: formData.graduation_year,
          bio: formData.bio,
          skills: skills,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Get student profile ID for projects
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (studentProfile) {
        // Delete existing projects
        await supabase
          .from('student_projects')
          .delete()
          .eq('student_id', studentProfile.id);

        // Insert new projects
        if (projects.length > 0) {
          const projectsToInsert = projects
            .filter(p => p.title.trim())
            .map(project => ({
              student_id: studentProfile.id,
              title: project.title,
              description: project.description,
              technologies: project.technologies
            }));

          if (projectsToInsert.length > 0) {
            const { error: projectsError } = await supabase
              .from('student_projects')
              .insert(projectsToInsert);

            if (projectsError) throw projectsError;
          }
        }
      }

      toast({
        title: "Profile saved successfully!",
        description: "Your profile is now visible to recruiters.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-xl text-gray-600">Build your profile and get discovered by top recruiters</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Profile Views</CardTitle>
              <Eye className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileViews}</div>
              <p className="text-xs opacity-90">Total views</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Skills Added</CardTitle>
              <Code className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}</div>
              <p className="text-xs opacity-90">Keep adding more!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Projects</CardTitle>
              <Trophy className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs opacity-90">Showcase your work</p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
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
                  <Input
                    id="graduationYear"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                    placeholder="2024"
                  />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingResumeUrl && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700">Resume uploaded successfully</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadResume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {resumeFile ? resumeFile.name : "Upload your resume (PDF, DOC, DOCX)"}
                </p>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      Choose File
                    </Button>
                    {resumeFile && (
                      <Button
                        type="button"
                        onClick={uploadResume}
                        disabled={uploadingResume}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {uploadingResume ? "Uploading..." : "Upload Resume"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchableMultiSelect
                options={commonSkills}
                selected={skills}
                onSelectionChange={setSkills}
                placeholder="Select your skills or type to add custom ones..."
                label="Skills"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Projects
              </CardTitle>
              <Button type="button" onClick={addProject} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">Project {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeProject(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Project Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        placeholder="My Awesome Project"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Describe your project, what it does, and your role..."
                        className="min-h-20"
                      />
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects added yet. Click "Add Project" to showcase your work!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-8"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
