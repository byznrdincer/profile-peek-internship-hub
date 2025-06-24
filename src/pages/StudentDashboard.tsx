import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, X, User, FileText, Code, Trophy, Eye, Download, Github, Globe, Linkedin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import SearchableMultiSelect from "@/components/SearchableMultiSelect";
import EnhancedSearchableMultiSelect from "@/components/EnhancedSearchableMultiSelect";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import VideoUpload from "@/components/VideoUpload";

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [projects, setProjects] = useState<Array<{id?: string, title: string, description: string, technologies: string[], video_url?: string}>>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  
  // Generate graduation year options from 2020 to 2030
  const graduationYearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = 2020 + i;
    return year.toString();
  });
  
  // Comprehensive skills list (2000+ skills across all engineering branches + top internship skills)
  const commonSkills = [
    // Technical Programming Skills
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust", "Swift", "Kotlin", 
    "Scala", "Ruby", "PHP", "Perl", "R", "MATLAB", "Objective-C", "Dart", "Elixir", "Haskell", 
    "Clojure", "F#", "Visual Basic", "COBOL", "Fortran", "Assembly", "Lua", "Julia", "Erlang",
    
    // Web Development
    "HTML5", "CSS3", "React", "Angular", "Vue.js", "Svelte", "Next.js", "Node.js", "Express.js", 
    "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "Web Development", "Frontend Development",
    "Backend Development", "Full Stack Development", "Responsive Design", "Progressive Web Apps",
    
    // Databases & Data
    "MongoDB", "MySQL", "PostgreSQL", "Redis", "SQL", "NoSQL", "Database Design", "Data Analysis", 
    "Data Science", "Machine Learning", "Artificial Intelligence", "Deep Learning", "Data Mining",
    "Big Data", "Hadoop", "Spark", "ETL", "Data Visualization", "Statistics", "Predictive Analytics",
    
    // Cloud & DevOps
    "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "DevOps", "CI/CD", "Jenkins",
    "Terraform", "Ansible", "Microservices", "Serverless", "Lambda Functions", "API Gateway",
    
    // Business Intelligence & Analytics
    "Power BI", "Tableau", "Excel (Advanced)", "Google Analytics", "Business Analytics", 
    "Financial Modeling", "Budgeting", "Forecasting", "KPI Tracking", "Dashboard Creation",
    
    // Cybersecurity
    "Cybersecurity", "Network Security", "Penetration Testing", "Ethical Hacking", "CISSP",
    "Security Auditing", "Vulnerability Assessment", "Incident Response", "Compliance",
    
    // Mobile Development
    "Mobile App Development", "iOS Development", "Android Development", "React Native", 
    "Flutter", "Xamarin", "Ionic", "PhoneGap", "Swift", "Kotlin",

    // Electrical & Electronics Engineering
    "Circuit Design", "PCB Design", "Analog Electronics", "Digital Electronics", "Microprocessors", 
    "Microcontrollers", "FPGA Programming", "VHDL", "Verilog", "SystemVerilog", "ARM Cortex", 
    "Arduino", "Raspberry Pi", "PIC Microcontroller", "8051 Microcontroller", "AVR", "STM32",
    "Power Electronics", "Power Systems", "Electrical Machines", "Motor Control", "Generator Design",
    "Transformers", "Transmission Lines", "Distribution Systems", "Smart Grid", "Renewable Energy",
    "Solar Panel Design", "Wind Energy Systems", "Battery Management Systems", "Inverters", "Converters",
    "Signal Processing", "Digital Signal Processing", "Image Processing", "Communications Systems",
    "Wireless Communication", "5G Technology", "LTE", "WiFi", "Bluetooth", "Zigbee", "LoRaWAN",
    "Antenna Design", "RF Engineering", "Microwave Engineering", "Satellite Communication",
    "Fiber Optics", "Optical Communication", "OFDM", "MIMO", "Modulation Techniques",
    "Control Systems", "PID Control", "Fuzzy Logic Control", "Neural Network Control",
    "Robotics Control", "Automation", "PLC Programming", "SCADA", "HMI Design", "DCS",
    "Instrumentation", "Sensors", "Actuators", "Data Acquisition", "LabVIEW", "MATLAB Simulink",
    "Altium Designer", "KiCad", "Eagle PCB", "Proteus", "LTSpice", "PSpice", "Cadence",
    "Xilinx Vivado", "Intel Quartus", "ModelSIM", "FPGA Design", "SoC Design", "ASIC Design",

    // Mechanical Engineering
    "SolidWorks", "AutoCAD", "CATIA", "Inventor", "Fusion 360", "Creo", "NX", "Ansys", "Abaqus",
    "Finite Element Analysis", "CFD", "Computational Fluid Dynamics", "Heat Transfer", "Thermodynamics",
    "Fluid Mechanics", "Strength of Materials", "Machine Design", "Mechanical Vibrations",
    "Kinematics", "Dynamics", "Statics", "Materials Science", "Manufacturing Processes",
    "CNC Programming", "CNC Machining", "3D Printing", "Additive Manufacturing", "Injection Molding",
    "Casting", "Forging", "Welding", "Sheet Metal", "Precision Engineering", "Quality Control",
    "Six Sigma", "Lean Manufacturing", "Kaizen", "5S", "TPM", "Statistical Process Control",
    "GD&T", "Geometric Dimensioning and Tolerancing", "Metrology", "CMM Programming",
    "Hydraulics", "Pneumatics", "Mechanical Systems", "HVAC Design", "Refrigeration",
    "Internal Combustion Engines", "Gas Turbines", "Steam Turbines", "Compressors", "Pumps",
    "Gear Design", "Bearing Selection", "Belt Drive Design", "Chain Drive", "Coupling Design",
    "Robotics", "Industrial Automation", "Mechatronics", "Servo Motors", "Stepper Motors",
    "Product Design", "Design for Manufacturing", "Design for Assembly", "Reverse Engineering",
    "Rapid Prototyping", "Tolerance Analysis", "Failure Analysis", "Reliability Engineering",

    // Civil Engineering
    "Structural Analysis", "Reinforced Concrete Design", "Steel Structure Design", "Foundation Design",
    "Earthquake Engineering", "Seismic Design", "Wind Load Analysis", "Structural Dynamics",
    "STAAD Pro", "ETABS", "SAP2000", "Robot Structural Analysis", "Tekla Structures", "Revit Structure",
    "Transportation Engineering", "Highway Design", "Traffic Engineering", "Pavement Design",
    "Bridge Design", "Tunnel Engineering", "Railway Engineering", "Airport Engineering",
    "Water Resources Engineering", "Hydrology", "Hydraulics", "Irrigation Engineering",
    "Water Supply Engineering", "Wastewater Treatment", "Stormwater Management", "Flood Control",
    "Environmental Engineering", "Air Pollution Control", "Water Treatment", "Solid Waste Management",
    "Environmental Impact Assessment", "Sustainability", "Green Building", "LEED Certification",
    "Geotechnical Engineering", "Soil Mechanics", "Rock Mechanics", "Foundation Engineering",
    "Slope Stability", "Retaining Wall Design", "Deep Foundation", "Shallow Foundation",
    "Construction Management", "Project Management", "Cost Estimation", "Construction Planning",
    "Building Information Modeling", "BIM", "Construction Safety", "Quality Assurance",
    "Surveying", "GPS Surveying", "Total Station", "Photogrammetry", "Remote Sensing", "GIS",
    "ArcGIS", "QGIS", "Land Development", "Urban Planning", "City Planning", "Zoning",

    // Chemical Engineering
    "Process Design", "Chemical Process Simulation", "Aspen Plus", "Aspen HYSYS", "ChemCAD",
    "Mass Transfer", "Heat Transfer", "Fluid Flow", "Thermodynamics", "Chemical Kinetics",
    "Reaction Engineering", "Reactor Design", "Distillation", "Absorption", "Extraction",
    "Crystallization", "Filtration", "Drying", "Evaporation", "Membrane Separation",
    "Unit Operations", "Process Control", "Instrumentation", "Process Safety", "HAZOP",
    "Risk Assessment", "Safety Management", "Process Optimization", "Six Sigma",
    "Petrochemical Engineering", "Refinery Processes", "Oil and Gas Processing", "Natural Gas",
    "Polymer Engineering", "Materials Engineering", "Nanotechnology", "Biotechnology",
    "Biochemical Engineering", "Fermentation", "Bioprocessing", "Pharmaceutical Engineering",

    // Business & Management Skills (Top Internship Skills)
    "Market Research", "Business Analytics", "Strategic Planning", "Financial Modeling", 
    "Budgeting", "Sales Forecasting", "Operations Management", "Risk Analysis", 
    "Project Management", "Agile", "Scrum", "Waterfall", "Resource Management",
    "Stakeholder Management", "Change Management", "Business Development",
    "Competitive Analysis", "SWOT Analysis", "Business Process Improvement",
    
    // CRM & Sales Tools
    "Salesforce", "HubSpot", "CRM Tools", "Lead Generation", "Sales Analytics",
    "Customer Relationship Management", "Account Management", "Pipeline Management",
    
    // Communication & Language Skills
    "Verbal Communication", "Written Communication", "Presentation Skills", "Email Etiquette",
    "Report Writing", "Active Listening", "Negotiation", "Public Speaking", "Interpersonal Skills",
    "Technical Writing", "Proposal Writing", "Documentation", "Cross-cultural Communication",
    "Spanish", "French", "German", "Mandarin", "Japanese", "Korean", "Hindi", "Arabic",
    
    // Leadership & Soft Skills
    "Leadership", "Team Management", "Time Management", "Teamwork", "Adaptability",
    "Problem-Solving", "Critical Thinking", "Creativity", "Innovation", "Conflict Resolution",
    "Emotional Intelligence", "Decision-Making", "Mentoring", "Coaching", "Delegation",
    "Performance Management", "Goal Setting", "Priority Management", "Stress Management",
    
    // Digital Marketing & Social Media
    "Social Media Marketing", "SEO", "Search Engine Optimization", "SEM", "Search Engine Marketing",
    "Content Creation", "Content Marketing", "Email Marketing", "Google Analytics", "Google Ads",
    "Facebook Ads", "Instagram Marketing", "LinkedIn Marketing", "Twitter Marketing",
    "Influencer Marketing", "Digital Ads", "PPC", "Pay-Per-Click", "Branding", "Copywriting",
    "Content Strategy", "Social Media Strategy", "Online Reputation Management", "Growth Hacking",
    
    // Design & Creative Skills
    "Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "Adobe XD", "Figma", "Sketch",
    "Canva", "UI/UX Design", "User Experience Design", "User Interface Design", "Graphic Design",
    "Web Design", "Logo Design", "Brand Design", "Print Design", "Typography", "Color Theory",
    "Wireframing", "Prototyping", "Design Thinking", "Visual Design", "Product Design",
    
    // Video & Animation
    "Video Editing", "Adobe Premiere Pro", "Final Cut Pro", "After Effects", "Motion Graphics",
    "Animation", "2D Animation", "3D Animation", "Blender", "Maya", "Cinema 4D",
    "Video Production", "Cinematography", "Storyboarding", "Video Marketing",
    
    // Research & Analysis
    "Research Methodology", "Quantitative Research", "Qualitative Research", "Survey Design",
    "Statistical Analysis", "SPSS", "SAS", "Data Collection", "Literature Review",
    "Market Analysis", "Consumer Research", "A/B Testing", "User Research", "Usability Testing",
    
    // Customer Service & Support
    "Customer Service", "Customer Support", "Help Desk", "Technical Support", "Client Relations",
    "Customer Success", "Customer Experience", "Service Desk", "Ticket Management",
    "Live Chat Support", "Phone Support", "Email Support", "Complaint Resolution",
    
    // E-commerce & Retail
    "E-commerce", "Online Retail", "Shopify", "WooCommerce", "Magento", "Amazon FBA",
    "Digital Commerce", "Inventory Management", "Supply Chain Management", "Logistics",
    "Warehouse Management", "Order Fulfillment", "Product Management", "Merchandising",
    
    // Finance & Accounting
    "Financial Analysis", "Accounting", "Bookkeeping", "Financial Reporting", "Tax Preparation",
    "Accounts Payable", "Accounts Receivable", "Payroll", "QuickBooks", "SAP", "Oracle",
    "Excel Financial Functions", "Investment Analysis", "Portfolio Management", "Risk Management",
    
    // Human Resources
    "Human Resources", "HR Management", "Recruitment", "Talent Acquisition", "Employee Relations",
    "Performance Management", "Training and Development", "Compensation and Benefits",
    "HR Analytics", "Workforce Planning", "Onboarding", "Employee Engagement",
    
    // Legal & Compliance
    "Legal Research", "Contract Management", "Compliance", "Regulatory Affairs", "Intellectual Property",
    "Patent Research", "Legal Writing", "Paralegal Skills", "Corporate Law", "Employment Law",
    
    // Event Management
    "Event Planning", "Event Management", "Conference Planning", "Wedding Planning",
    "Corporate Events", "Trade Shows", "Event Marketing", "Vendor Management", "Budget Management",
    
    // Healthcare & Life Sciences
    "Healthcare Administration", "Medical Terminology", "Clinical Research", "Pharmaceutical",
    "Biomedical Engineering", "Medical Device Design", "Healthcare IT", "HIPAA Compliance",
    "Electronic Health Records", "Healthcare Analytics", "Public Health", "Epidemiology",
    
    // Education & Training
    "Curriculum Development", "Educational Technology", "E-learning", "Training Design",
    "Instructional Design", "Learning Management Systems", "Educational Assessment",
    "Student Support Services", "Academic Advising", "Teaching", "Tutoring",
    
    // Emerging Technologies
    "Internet of Things", "IoT", "Industry 4.0", "Digital Twin", "Augmented Reality", "Virtual Reality",
    "Mixed Reality", "Blockchain", "Cryptocurrency", "NFT", "Metaverse", "Web3",
    "Quantum Computing", "Edge Computing", "5G Technology", "Smart Cities", "Autonomous Vehicles",
    
    // No-Code/Low-Code
    "No-Code Development", "Low-Code Platforms", "Bubble", "Webflow", "Zapier", "Microsoft Power Platform",
    "Airtable", "Notion", "Process Automation", "Workflow Automation", "RPA",
    
    // Remote Work & Collaboration
    "Remote Work", "Virtual Collaboration", "Slack", "Microsoft Teams", "Zoom", "Asana",
    "Trello", "Monday.com", "Jira", "Confluence", "Git", "GitHub", "Version Control",
    "Remote Team Management", "Digital Nomad Skills", "Virtual Presentation",
    
    // Specialized Industry Skills
    "Automotive Engineering", "Aerospace Engineering", "Biomedical Engineering", "Mining Engineering",
    "Petroleum Engineering", "Nuclear Engineering", "Agricultural Engineering", "Food Engineering",
    "Textile Engineering", "Marine Engineering", "Environmental Engineering", "Materials Science",
    
    // Quality & Testing
    "Quality Assurance", "Quality Control", "Software Testing", "Manual Testing", "Automated Testing",
    "Test Planning", "Bug Tracking", "ISO Standards", "Continuous Improvement", "Process Improvement",
    
    // Consulting & Advisory
    "Management Consulting", "Business Consulting", "Technical Consulting", "Strategy Consulting",
    "Process Consulting", "Change Management", "Organizational Development", "Business Analysis",
    
    // Certifications & Standards
    "PMP", "Agile Certification", "Scrum Master", "Six Sigma Black Belt", "ITIL", "ISO 9001",
    "PE License", "FE Exam", "Professional Engineer", "Chartered Engineer", "AWS Certified",
    "Google Certified", "Microsoft Certified", "Salesforce Certified", "CompTIA",
    
    // Specialized Software Tools
    "Mathematica", "Maple", "MathCAD", "Octave", "LabWindows", "National Instruments",
    "System Identification", "Parameter Estimation", "Optimization", "Genetic Algorithms",
    "Surpac", "MineSight", "Datamine", "Vulcan", "Gemcom", "Eclipse", "CMG", "Petrel", "Techlog",
    
    // Interview & Career Skills
    "Resume Writing", "Interview Preparation", "Career Development", "Professional Networking",
    "LinkedIn Optimization", "Personal Branding", "Job Search Strategies", "Salary Negotiation",
    
    // Diversity & Inclusion
    "DEI", "Diversity and Inclusion", "Cultural Competency", "Unconscious Bias Training",
    "Inclusive Leadership", "Cross-Cultural Awareness", "Global Mindset",
    
    // Sustainability & Environmental
    "Sustainability", "Environmental Management", "Carbon Footprint", "Life Cycle Assessment",
    "Green Technology", "Renewable Energy", "Environmental Compliance", "Sustainable Design",
    "Circular Economy", "Climate Change", "Environmental Impact Assessment",
    
    // Prompt Engineering & AI
    "Prompt Engineering", "AI Tools", "ChatGPT", "Large Language Models", "AI Ethics",
    "Machine Learning Operations", "MLOps", "Natural Language Processing", "Computer Vision",
    "AI Product Management", "AI Strategy"
  ];
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    university: "",
    major: "",
    graduation_year: "",
    bio: "",
    location: "",
    github_url: "",
    website_url: "",
    linkedin_url: "",
    stipend_expectation: "",
    internship_type_preference: "",
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
        location: profile.location || "",
        github_url: profile.github_url || "",
        website_url: profile.website_url || "",
        linkedin_url: profile.linkedin_url || "",
        stipend_expectation: profile.stipend_expectation || "",
        internship_type_preference: profile.internship_type_preference || "",
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
          technologies: p.technologies || [],
          video_url: p.video_url
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

  const updateProject = (index: number, field: string, value: string | string[]) => {
    const updated = [...projects];
    if (field === 'technologies') {
      updated[index][field] = Array.isArray(value) ? value : value.split(',').map(t => t.trim());
    } else {
      updated[index][field] = value as string;
    }
    setProjects(updated);
  };

  const updateProjectVideo = (index: number, videoUrl: string) => {
    const updated = [...projects];
    updated[index].video_url = videoUrl;
    setProjects(updated);
  };

  const removeProjectVideo = (index: number) => {
    const updated = [...projects];
    delete updated[index].video_url;
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
          location: formData.location,
          github_url: formData.github_url,
          website_url: formData.website_url,
          linkedin_url: formData.linkedin_url,
          stipend_expectation: formData.stipend_expectation,
          internship_type_preference: formData.internship_type_preference,
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
              technologies: project.technologies,
              video_url: project.video_url
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Internship Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="internship_type_preference">Internship Type Preference</Label>
                  <Select
                    value={formData.internship_type_preference}
                    onValueChange={(value) => setFormData({...formData, internship_type_preference: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Internships Only</SelectItem>
                      <SelectItem value="unpaid">Unpaid Internships Only</SelectItem>
                      <SelectItem value="both">Both Paid & Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stipend_expectation">Stipend Expectation</Label>
                  <Input
                    id="stipend_expectation"
                    value={formData.stipend_expectation}
                    onChange={(e) => setFormData({...formData, stipend_expectation: e.target.value})}
                    placeholder="e.g., $1000/month, Negotiable, Not applicable"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Help recruiters understand your internship preferences and expected compensation.
              </p>
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
                Skills & Competencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchableMultiSelect
                options={commonSkills}
                selected={skills}
                onSelectionChange={setSkills}
                placeholder="Select your skills from engineering, business, digital marketing, and all internship-relevant competencies..."
                label="Professional Skills"
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
                      <EnhancedSearchableMultiSelect
                        options={commonSkills}
                        selected={project.technologies}
                        onSelectionChange={(technologies) => updateProject(index, 'technologies', technologies)}
                        placeholder="Add technologies used in this project..."
                        label="Technologies Used"
                      />
                    </div>
                    <VideoUpload
                      projectId={project.id || index}
                      existingVideoUrl={project.video_url}
                      onVideoUploaded={(videoUrl) => updateProjectVideo(index, videoUrl)}
                      onVideoRemoved={() => removeProjectVideo(index)}
                    />
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
