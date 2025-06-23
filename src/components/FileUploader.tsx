
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface FileUploaderProps {
  onFileUploaded: (url: string, filename: string) => void;
  userId: string;
  initialResumeUrl?: string;
}

const FileUploader = ({ onFileUploaded, userId, initialResumeUrl }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-resume-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      onFileUploaded(data.publicUrl, file.name);
      
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been saved.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="resume-upload">Upload Resume (PDF or Word)</Label>
      <Input
        id="resume-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && (
        <p className="text-sm text-gray-500">Uploading...</p>
      )}
      {initialResumeUrl && (
        <div className="text-sm">
          <a 
            href={initialResumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View current resume
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
