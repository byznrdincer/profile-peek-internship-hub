
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
    console.log('Starting PDF generation for student:', student?.name);
    console.log('Student data:', student);
    console.log('Certifications data:', certifications);

    // Validate required data
    if (!student) {
      throw new Error('Student data is required');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    console.log('PDF document created, page width:', pageWidth);

    // Helper function to safely add text
    const safeAddText = (text: string | undefined | null, x: number, y: number, fontSize: number = 10) => {
      try {
        if (!text || typeof text !== 'string') return;
        doc.setFontSize(fontSize);
        doc.text(String(text).substring(0, 100), x, y); // Limit text length
      } catch (error) {
        console.error('Error adding text:', error, 'Text:', text);
      }
    };

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      try {
        if (!text || typeof text !== 'string') return y;
        
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      } catch (error) {
        console.error('Error adding wrapped text:', error);
        return y + 10;
      }
    };

    console.log('Helper functions defined');

    // Header
    try {
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 30, 'filled');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Student Profile Summary', 20, 20);
      
      yPosition = 45;
      doc.setTextColor(0, 0, 0);
      console.log('Header added successfully');
    } catch (error) {
      console.error('Error creating header:', error);
      throw new Error('Failed to create PDF header');
    }

    // Student Name and Basic Info
    try {
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
      console.log('Basic info added successfully');
    } catch (error) {
      console.error('Error adding basic info:', error);
      throw new Error('Failed to add basic student information');
    }

    // Contact Information
    try {
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
      console.log('Contact info added successfully');
    } catch (error) {
      console.error('Error adding contact info:', error);
    }

    // Bio/About
    try {
      if (student.bio) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('About', 20, yPosition);
        yPosition += 8;

        doc.setFont(undefined, 'normal');
        yPosition = addWrappedText(student.bio, 20, yPosition, pageWidth - 40, 10);
        yPosition += 5;
      }
      console.log('Bio added successfully');
    } catch (error) {
      console.error('Error adding bio:', error);
    }

    // Skills
    try {
      if (student.skills && Array.isArray(student.skills) && student.skills.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Skills & Technologies', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const skillsText = student.skills.filter(skill => skill && typeof skill === 'string').join(', ');
        if (skillsText) {
          yPosition = addWrappedText(skillsText, 20, yPosition, pageWidth - 40, 10);
          yPosition += 5;
        }
      }
      console.log('Skills added successfully');
    } catch (error) {
      console.error('Error adding skills:', error);
    }

    // Projects
    try {
      if (student.projects && Array.isArray(student.projects) && student.projects.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Projects', 20, yPosition);
        yPosition += 8;

        student.projects.forEach((project, index) => {
          if (!project || typeof project !== 'object') return;
          
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

          if (project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0) {
            doc.setFont(undefined, 'italic');
            const techText = project.technologies.filter(tech => tech && typeof tech === 'string').join(', ');
            if (techText) {
              safeAddText(`Technologies: ${techText}`, 25, yPosition, 10);
              yPosition += 5;
            }
          }

          yPosition += 3;
        });
        yPosition += 5;
      }
      console.log('Projects added successfully');
    } catch (error) {
      console.error('Error adding projects:', error);
    }

    // Footer
    try {
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        const footerText = `Generated on ${new Date().toLocaleDateString()} | Profile Views: ${student.profile_views || 0}`;
        safeAddText(footerText, 20, doc.internal.pageSize.height - 10, 8);
        safeAddText(`Page ${i} of ${totalPages}`, pageWidth - 30, doc.internal.pageSize.height - 10, 8);
      }
      console.log('Footer added successfully');
    } catch (error) {
      console.error('Error adding footer:', error);
    }

    // Save the PDF
    try {
      const fileName = `${(student.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_')}_Profile_Summary.pdf`;
      console.log('Saving PDF with filename:', fileName);
      doc.save(fileName);
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save PDF file');
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
