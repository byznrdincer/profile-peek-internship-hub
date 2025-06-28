import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import StatsCards from "@/components/student/StatsCards";
import PersonalInfoSection from "@/components/student/PersonalInfoSection";
import InternshipPreferencesSection from "@/components/student/InternshipPreferencesSection";
import SkillsSection from "@/components/student/SkillsSection";
import ProjectsSection from "@/components/student/ProjectsSection";
import CertificationsSection from "@/components/student/CertificationsSection";

const StudentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Array<{id?: string, title: string, description: string, technologies: string[], video_url?: string}>>([]);
  const [certifications, setCertifications] = useState<Array<{
    id?: string;
    certification_name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date: string;
    credential_id: string;
    credential_url: string;
    certificate_file_url?: string;
    certificate_filename?: string;
  }>>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  
  // Generate graduation year options from 2015 to 2030
  const graduationYearOptions = Array.from({ length: 16 }, (_, i) => {
    const year = 2015 + i;
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
    email: "",
    university: "",
    major: "",
    graduation_year: "",
    bio: "",
    location: "",
    github_url: "",
    website_url: "",
    linkedin_url: "",
    internship_type_preference: "",
    paid_internship_preference: "",
    preferred_internship_location: "",
    preferred_locations: [] as string[],
    open_to_relocate: false,
    multiple_website_urls: [] as string[],
  });

  // Load existing profile data
  useEffect(() => {
    if (user) {
      loadProfile();
      loadProjects();
      loadCertifications();
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
        email: profile.email || "",
        university: profile.university || "",
        major: profile.major || "",
        graduation_year: profile.graduation_year || "",
        bio: profile.bio || "",
        location: profile.location || "",
        github_url: profile.github_url || "",
        website_url: profile.website_url || "",
        linkedin_url: profile.linkedin_url || "",
        internship_type_preference: profile.internship_type_preference || "",
        paid_internship_preference: (profile as any).paid_internship_preference || "",
        preferred_internship_location: profile.preferred_internship_location || "",
        preferred_locations: profile.preferred_locations || [],
        open_to_relocate: profile.open_to_relocate || false,
        multiple_website_urls: profile.multiple_website_urls || [],
      });
      setSkills(profile.skills || []);
      setProfileViews(profile.profile_views || 0);
      setStudentProfile(profile);
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

  const loadCertifications = async () => {
    if (!user) return;

    const { data: studentProfile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (studentProfile) {
      const { data: certificationsData, error } = await supabase
        .from('student_certifications')
        .select('*')
        .eq('student_id', studentProfile.id);

      if (!error && certificationsData) {
        setCertifications(certificationsData.map(cert => ({
          id: cert.id,
          certification_name: cert.certification_name,
          issuing_organization: cert.issuing_organization || "",
          issue_date: cert.issue_date || "",
          expiry_date: cert.expiry_date || "",
          credential_id: cert.credential_id || "",
          credential_url: cert.credential_url || "",
          certificate_file_url: cert.certificate_file_url,
          certificate_filename: cert.certificate_filename
        })));
      }
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
          email: formData.email,
          university: formData.university,
          major: formData.major,
          graduation_year: formData.graduation_year,
          bio: formData.bio,
          location: formData.location,
          github_url: formData.github_url,
          website_url: formData.website_url,
          linkedin_url: formData.linkedin_url,
          internship_type_preference: formData.internship_type_preference,
          paid_internship_preference: formData.paid_internship_preference,
          preferred_internship_location: formData.preferred_internship_location,
          preferred_locations: formData.preferred_locations,
          open_to_relocate: formData.open_to_relocate,
          multiple_website_urls: formData.multiple_website_urls,
          skills: skills,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Get student profile ID for projects and certifications
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

        // Delete existing certifications
        await supabase
          .from('student_certifications')
          .delete()
          .eq('student_id', studentProfile.id);

        // Insert new certifications
        if (certifications.length > 0) {
          const certificationsToInsert = certifications
            .filter(cert => cert.certification_name.trim())
            .map(certification => ({
              student_id: studentProfile.id,
              certification_name: certification.certification_name,
              issuing_organization: certification.issuing_organization,
              issue_date: certification.issue_date || null,
              expiry_date: certification.expiry_date || null,
              credential_id: certification.credential_id,
              credential_url: certification.credential_url,
              certificate_file_url: certification.certificate_file_url,
              certificate_filename: certification.certificate_filename
            }));

          if (certificationsToInsert.length > 0) {
            const { error: certificationsError } = await supabase
              .from('student_certifications')
              .insert(certificationsToInsert);

            if (certificationsError) throw certificationsError;
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

        <StatsCards
          profileViews={profileViews}
          skillsCount={skills.length}
          projectsCount={projects.length}
          studentProfile={studentProfile}
          skills={skills}
          projects={projects}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <PersonalInfoSection
            formData={formData}
            setFormData={setFormData}
            graduationYearOptions={graduationYearOptions}
          />

          <InternshipPreferencesSection
            formData={formData}
            setFormData={setFormData}
          />

          <SkillsSection
            skills={skills}
            setSkills={setSkills}
            commonSkills={commonSkills}
          />

          <ProjectsSection
            projects={projects}
            setProjects={setProjects}
            commonSkills={commonSkills}
          />

          <CertificationsSection
            certifications={certifications}
            setCertifications={setCertifications}
          />

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
