
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ResumeUploadSectionProps {
  existingResumeUrl: string | null;
  setExistingResumeUrl: (url: string | null) => void;
}

const ResumeUploadSection = ({ existingResumeUrl, setExistingResumeUrl }: ResumeUploadSectionProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

  const deleteResume = async () => {
    if (!existingResumeUrl || !user) return;

    setDeletingResume(true);
    try {
      // Extract the file path from the URL
      const urlParts = existingResumeUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;
      
      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([filePath]);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Update profile to remove resume info
      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({ 
          resume_url: null,
          resume_filename: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      setExistingResumeUrl(null);
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been removed successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingResume(false);
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

  return (
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadResume}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={deleteResume}
                disabled={deletingResume}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deletingResume ? "Deleting..." : "Delete"}
              </Button>
            </div>
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
  );
};

export default ResumeUploadSection;
