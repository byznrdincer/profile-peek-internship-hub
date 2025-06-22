
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, Video, X, Play } from 'lucide-react';

interface VideoUploadProps {
  projectId: string | number;
  existingVideoUrl?: string;
  onVideoUploaded: (videoUrl: string) => void;
  onVideoRemoved: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  projectId,
  existingVideoUrl,
  onVideoUploaded,
  onVideoRemoved
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB.",
        variant: "destructive",
      });
      return;
    }

    // Check video duration (2 minutes limit)
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      
      if (duration > 120) { // 2 minutes = 120 seconds
        toast({
          title: "Video too long",
          description: "Please upload a video shorter than 2 minutes.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "Video selected",
        description: `${file.name} is ready to upload (${Math.round(duration)}s).`,
      });
    };
    
    video.src = URL.createObjectURL(file);
  };

  const uploadVideo = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/project_${projectId}_${Date.now()}.${fileExt}`;

      console.log('Uploading video:', fileName);

      // Delete existing video if any
      if (existingVideoUrl) {
        const oldFileName = existingVideoUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('project-videos')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('project-videos')
        .upload(fileName, selectedFile, { 
          upsert: false,
          contentType: selectedFile.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-videos')
        .getPublicUrl(fileName);

      onVideoUploaded(publicUrl);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById(`video-upload-${projectId}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      toast({
        title: "Video uploaded successfully!",
        description: "Your project video has been uploaded.",
      });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = async () => {
    if (!existingVideoUrl || !user) return;

    try {
      const fileName = existingVideoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('project-videos')
          .remove([`${user.id}/${fileName}`]);
      }

      onVideoRemoved();
      toast({
        title: "Video removed",
        description: "Your project video has been removed.",
      });
    } catch (error: any) {
      console.error('Error removing video:', error);
      toast({
        title: "Remove failed",
        description: "There was an error removing your video.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          Project Video <span className="text-gray-500">(Optional - Max 2 minutes)</span>
        </Label>
      </div>

      {existingVideoUrl ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Video uploaded successfully</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(existingVideoUrl, '_blank')}
              >
                <Play className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeVideo}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
          <Video className="h-6 w-6 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-3">
            {selectedFile ? selectedFile.name : "Upload a 2-minute video describing your project"}
          </p>
          <div className="space-y-2">
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              id={`video-upload-${projectId}`}
            />
            <div className="flex gap-2 justify-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById(`video-upload-${projectId}`)?.click()}
              >
                <Upload className="h-4 w-4 mr-1" />
                Choose Video
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  size="sm"
                  onClick={uploadVideo}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? "Uploading..." : "Upload Video"}
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: MP4, MOV, AVI, etc. Max size: 100MB
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
