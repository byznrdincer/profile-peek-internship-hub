
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";
import SearchableMultiSelect from "@/components/SearchableMultiSelect";

interface SkillsSectionProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
  commonSkills: string[];
}

const SkillsSection = ({ skills, setSkills, commonSkills }: SkillsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Skills & Competencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchableMultiSelect
          options={commonSkills}
          selected={skills}
          onSelectionChange={setSkills}
          placeholder="Select your skills from engineering, business, digital marketing, and all internship-relevant competencies..."
          label="Professional Skills"
        />
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
