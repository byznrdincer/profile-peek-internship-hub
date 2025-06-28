
import jsPDF from 'jspdf';

interface StudentData {
  name: string;
  email?: string;
  phone?: string;
  university: string;
  major: string;
  graduation_year: string;
  location?: string;
  bio?: string;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string[];
    video_url?: string;
    demo_url?: string;
  }>;
  github_url?: string;
  linkedin_url?: string;
  multiple_website_urls?: string[];
  website_url?: string;
  internship_type_preference?: string;
  preferred_locations?: string[];
  open_to_relocate?: boolean;
  profile_views?: number;
}

interface CertificationData {
  certification_name: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
}

export const generateStudentProfilePDF = (student: StudentData, certifications: CertificationData[] = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Header
  doc.setFillColor(59, 130, 246); // Blue color
  doc.rect(0, 0, pageWidth, 30, 'filled');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Student Profile Summary', 20, 20);
  
  yPosition = 45;
  doc.setTextColor(0, 0, 0);

  // Student Name and Basic Info
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(student.name || 'Student Name', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`${student.major} | ${student.university} | Class of ${student.graduation_year}`, 20, yPosition);
  yPosition += 8;

  if (student.location) {
    doc.text(`Location: ${student.location}`, 20, yPosition);
    yPosition += 6;
  }

  yPosition += 5;

  // Contact Information
  if (student.email || student.phone) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Contact Information', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    if (student.email) {
      doc.text(`Email: ${student.email}`, 20, yPosition);
      yPosition += 5;
    }
    if (student.phone) {
      doc.text(`Phone: ${student.phone}`, 20, yPosition);
      yPosition += 5;
    }
    yPosition += 5;
  }

  // Bio/About
  if (student.bio) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('About', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    yPosition = addWrappedText(student.bio, 20, yPosition, pageWidth - 40, 10);
    yPosition += 5;
  }

  // Internship Preferences
  if (student.internship_type_preference || student.preferred_locations?.length || student.open_to_relocate) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Internship Preferences', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    if (student.internship_type_preference) {
      const typeDisplay = student.internship_type_preference === 'paid' ? 'Paid Only' :
                         student.internship_type_preference === 'unpaid' ? 'Unpaid Only' :
                         student.internship_type_preference === 'both' ? 'Both Paid & Unpaid' : 
                         student.internship_type_preference;
      doc.text(`Internship Type: ${typeDisplay}`, 20, yPosition);
      yPosition += 5;
    }

    if (student.preferred_locations?.length) {
      doc.text(`Preferred Locations: ${student.preferred_locations.join(', ')}`, 20, yPosition);
      yPosition += 5;
    }

    if (student.open_to_relocate) {
      doc.text('Open to Relocate: Yes', 20, yPosition);
      yPosition += 5;
    }
    yPosition += 5;
  }

  // Skills
  if (student.skills?.length) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Skills & Technologies', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const skillsText = student.skills.join(', ');
    yPosition = addWrappedText(skillsText, 20, yPosition, pageWidth - 40, 10);
    yPosition += 5;
  }

  // Projects
  if (student.projects?.length) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Projects', 20, yPosition);
    yPosition += 8;

    student.projects.forEach((project, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${project.title}`, 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      if (project.description) {
        yPosition = addWrappedText(project.description, 25, yPosition, pageWidth - 50, 10);
      }

      if (project.technologies?.length) {
        doc.setFont(undefined, 'italic');
        doc.text(`Technologies: ${project.technologies.join(', ')}`, 25, yPosition);
        yPosition += 5;
      }

      if (project.video_url) {
        doc.setFont(undefined, 'normal');
        doc.text('• Video demonstration available', 25, yPosition);
        yPosition += 5;
      }

      if (project.demo_url) {
        doc.setFont(undefined, 'normal');
        doc.text('• Live demo available', 25, yPosition);
        yPosition += 5;
      }

      yPosition += 3;
    });
    yPosition += 5;
  }

  // Certifications
  if (certifications.length > 0) {
    // Check if we need a new page
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Certifications', 20, yPosition);
    yPosition += 8;

    certifications.forEach((cert, index) => {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${cert.certification_name}`, 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      if (cert.issuing_organization) {
        doc.text(`Issued by: ${cert.issuing_organization}`, 25, yPosition);
        yPosition += 5;
      }

      if (cert.issue_date) {
        const issueDate = new Date(cert.issue_date).toLocaleDateString();
        doc.text(`Issue Date: ${issueDate}`, 25, yPosition);
        yPosition += 5;
      }

      if (cert.credential_id) {
        doc.text(`Credential ID: ${cert.credential_id}`, 25, yPosition);
        yPosition += 5;
      }

      yPosition += 3;
    });
    yPosition += 5;
  }

  // Social Links
  const hasLinks = student.github_url || student.linkedin_url || 
                   student.multiple_website_urls?.length || student.website_url;
  
  if (hasLinks) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Professional Links', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    if (student.github_url) {
      doc.text(`GitHub: ${student.github_url}`, 20, yPosition);
      yPosition += 5;
    }

    if (student.linkedin_url) {
      doc.text(`LinkedIn: ${student.linkedin_url}`, 20, yPosition);
      yPosition += 5;
    }

    if (student.multiple_website_urls?.length) {
      student.multiple_website_urls.forEach((url, index) => {
        if (url && url.trim()) {
          doc.text(`Website ${index + 1}: ${url}`, 20, yPosition);
          yPosition += 5;
        }
      });
    }

    if (student.website_url) {
      doc.text(`Portfolio: ${student.website_url}`, 20, yPosition);
      yPosition += 5;
    }
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | Profile Views: ${student.profile_views || 0}`, 20, doc.internal.pageSize.height - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  const fileName = `${student.name?.replace(/\s+/g, '_') || 'Student'}_Profile_Summary.pdf`;
  doc.save(fileName);
};
