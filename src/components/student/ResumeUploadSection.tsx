import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
      // 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      // File type check
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
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("user_id", user.id.toString());

      // Upload endpoint (backendde bu endpointin olması gerekir)
      const response = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const publicUrl = data.public_url;

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
      const response = await fetch("/api/delete/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          resume_url: existingResumeUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setExistingResumeUrl(null);

      toast({
        title: "Resume deleted",
        description: "Your resume has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingResume(false);
    }
  };

  const downloadResume = async () => {
    if (!existingResumeUrl) return;

    try {
      const response = await fetch(existingResumeUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = existingResumeUrl.split('/').pop() || "resume";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message || "There was an error downloading your resume.",
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
