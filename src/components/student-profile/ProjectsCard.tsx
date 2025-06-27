
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Video, Play, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectsCardProps {
  student: any;
}

const ProjectsCard = ({ student }: ProjectsCardProps) => {
  const { toast } = useToast();

  const handleWatchVideo = (videoUrl: string, projectTitle: string) => {
    window.open(videoUrl, '_blank');
    toast({
      title: "Opening video",
      description: `Watching ${projectTitle} project video`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Projects ({student.projects?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {student.projects?.map((project: any, index: number) => (
          <div key={index} className="border-l-4 border-blue-200 pl-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                {project.video_url && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video Available
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {project.demo_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(project.demo_url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Demo
                  </Button>
                )}
                {project.video_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleWatchVideo(project.video_url, project.title)}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Video
                  </Button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-3 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech: string, techIndex: number) => (
                <Badge key={techIndex} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.demo_url && (
                <Badge variant="default" className="text-xs bg-purple-500 hover:bg-purple-600 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Live Demo
                </Badge>
              )}
            </div>
          </div>
        ))}
        {(!student.projects || student.projects.length === 0) && (
          <p className="text-gray-500 text-center py-4">No projects added yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
