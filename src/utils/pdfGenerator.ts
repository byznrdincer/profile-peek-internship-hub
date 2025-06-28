
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
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      if (!text || typeof text !== 'string') return y;
      
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to safely add text
    const safeAddText = (text: string | undefined | null, x: number, y: number, fontSize: number = 10) => {
      if (!text) return;
      doc.setFontSize(fontSize);
      doc.text(String(text), x, y);
    };

    // Header
    doc.setFillColor(59, 130, 246);
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
    safeAddText(student.name || 'Student Name', 20, yPosition, 18);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const basicInfo = `${student.major || 'Major not specified'} | ${student.university || 'University not specified'} | Class of ${student.graduation_year || 'N/A'}`;
    safeAddText(basicInfo, 20, yPosition, 12);
    yPosition += 8;

    if (student.location) {
      safeAddText(`Location: ${student.location}`, 20, yPosition, 12);
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
        safeAddText(`Email: ${student.email}`, 20, yPosition, 10);
        yPosition += 5;
      }
      if (student.phone) {
        safeAddText(`Phone: ${student.phone}`, 20, yPosition, 10);
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
    if (student.internship_type_preference || (student.preferred_locations && student.preferred_locations.length > 0) || student.open_to_relocate) {
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
        safeAddText(`Internship Type: ${typeDisplay}`, 20, yPosition, 10);
        yPosition += 5;
      }

      if (student.preferred_locations && student.preferred_locations.length > 0) {
        safeAddText(`Preferred Locations: ${student.preferred_locations.join(', ')}`, 20, yPosition, 10);
        yPosition += 5;
      }

      if (student.open_to_relocate) {
        safeAddText('Open to Relocate: Yes', 20, yPosition, 10);
        yPosition += 5;
      }
      yPosition += 5;
    }

    // Skills
    if (student.skills && student.skills.length > 0) {
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
    if (student.projects && student.projects.length > 0) {
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
        safeAddText(`${index + 1}. ${project.title || 'Untitled Project'}`, 20, yPosition, 12);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        if (project.description) {
          yPosition = addWrappedText(project.description, 25, yPosition, pageWidth - 50, 10);
        }

        if (project.technologies && project.technologies.length > 0) {
          doc.setFont(undefined, 'italic');
          safeAddText(`Technologies: ${project.technologies.join(', ')}`, 25, yPosition, 10);
          yPosition += 5;
        }

        if (project.video_url) {
          doc.setFont(undefined, 'normal');
          safeAddText('• Video demonstration available', 25, yPosition, 10);
          yPosition += 5;
        }

        if (project.demo_url) {
          doc.setFont(undefined, 'normal');
          safeAddText('• Live demo available', 25, yPosition, 10);
          yPosition += 5;
        }

        yPosition += 3;
      });
      yPosition += 5;
    }

    // Certifications
    if (certifications && certifications.length > 0) {
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
        safeAddText(`${index + 1}. ${cert.certification_name || 'Certification'}`, 20, yPosition, 12);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        if (cert.issuing_organization) {
          safeAddText(`Issued by: ${cert.issuing_organization}`, 25, yPosition, 10);
          yPosition += 5;
        }

        if (cert.issue_date) {
          try {
            const issueDate = new Date(cert.issue_date).toLocaleDateString();
            safeAddText(`Issue Date: ${issueDate}`, 25, yPosition, 10);
            yPosition += 5;
          } catch (e) {
            // Skip invalid date
          }
        }

        if (cert.credential_id) {
          safeAddText(`Credential ID: ${cert.credential_id}`, 25, yPosition, 10);
          yPosition += 5;
        }

        yPosition += 3;
      });
      yPosition += 5;
    }

    // Social Links
    const hasLinks = student.github_url || student.linkedin_url || 
                     (student.multiple_website_urls && student.multiple_website_urls.length > 0) || 
                     student.website_url;
    
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
        safeAddText(`GitHub: ${student.github_url}`, 20, yPosition, 10);
        yPosition += 5;
      }

      if (student.linkedin_url) {
        safeAddText(`LinkedIn: ${student.linkedin_url}`, 20, yPosition, 10);
        yPosition += 5;
      }

      if (student.multiple_website_urls && student.multiple_website_urls.length > 0) {
        student.multiple_website_urls.forEach((url, index) => {
          if (url && url.trim()) {
            safeAddText(`Website ${index + 1}: ${url}`, 20, yPosition, 10);
            yPosition += 5;
          }
        });
      }

      if (student.website_url) {
        safeAddText(`Portfolio: ${student.website_url}`, 20, yPosition, 10);
        yPosition += 5;
      }
    }

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      const footerText = `Generated on ${new Date().toLocaleDateString()} | Profile Views: ${student.profile_views || 0}`;
      safeAddText(footerText, 20, doc.internal.pageSize.height - 10, 8);
      safeAddText(`Page ${i} of ${totalPages}`, pageWidth - 30, doc.internal.pageSize.height - 10, 8);
    }

    // Save the PDF
    const fileName = `${(student.name || 'Student').replace(/\s+/g, '_')}_Profile_Summary.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please check the data and try again.');
  }
};
