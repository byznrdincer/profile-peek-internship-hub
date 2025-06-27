
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Trophy } from "lucide-react";
import EnhancedSearchableMultiSelect from "@/components/EnhancedSearchableMultiSelect";
import VideoUpload from "@/components/VideoUpload";

interface ProjectsSectionProps {
  projects: Array<{id?: string, title: string, description: string, technologies: string[], video_url?: string}>;
  setProjects: (projects: any[]) => void;
  commonSkills: string[];
}

const ProjectsSection = ({ projects, setProjects, commonSkills }: ProjectsSectionProps) => {
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

  return (
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
  );
};

export default ProjectsSection;
