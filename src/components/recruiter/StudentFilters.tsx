
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface StudentFiltersProps {
  majorFilter: string;
  setMajorFilter: (value: string) => void;
  skillFilter: string;
  setSkillFilter: (value: string) => void;
  projectSkillFilter: string;
  setProjectSkillFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  graduationYearFilter: string;
  setGraduationYearFilter: (value: string) => void;
  internshipTypeFilter: string;
  setInternshipTypeFilter: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
}

const StudentFilters = ({
  majorFilter,
  setMajorFilter,
  skillFilter,
  setSkillFilter,
  projectSkillFilter,
  setProjectSkillFilter,
  locationFilter,
  setLocationFilter,
  graduationYearFilter,
  setGraduationYearFilter,
  internshipTypeFilter,
  setInternshipTypeFilter,
  onClearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}: StudentFiltersProps) => {
  // Generate graduation year options from 2015 to 2030
  const graduationYearOptions = Array.from({ length: 16 }, (_, i) => {
    const year = 2015 + i;
    return year.toString();
  });

  const internshipTypes = [
    "Full-time",
    "Part-time", 
    "Remote",
    "On-site",
    "Hybrid"
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Students
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} students
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              placeholder="Filter by major..."
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="skill">General Skills</Label>
            <Input
              id="skill"
              placeholder="python java react (space/comma separated)"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
            <p className="text-xs text-blue-600 mt-1">
              Use spaces or commas to search multiple skills (matches any)
            </p>
          </div>

          <div>
            <Label htmlFor="projectSkill">Project Search</Label>
            <Input
              id="projectSkill"
              placeholder="react node.js api (space/comma separated)"
              value={projectSkillFilter}
              onChange={(e) => setProjectSkillFilter(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
            <p className="text-xs text-purple-600 mt-1">
              Searches technologies, titles, descriptions (matches any term)
            </p>
          </div>

          <div>
            <LocationAutocomplete
              label="Preferred Location"
              value={locationFilter}
              onChange={setLocationFilter}
              placeholder="new york california (space/comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use spaces or commas for multiple locations (matches any)
            </p>
          </div>

          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Select
              value={graduationYearFilter}
              onValueChange={setGraduationYearFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {graduationYearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="internshipType">Internship Type</Label>
            <Select
              value={internshipTypeFilter}
              onValueChange={setInternshipTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {internshipTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {majorFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Major: {majorFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setMajorFilter("")}
                />
              </Badge>
            )}
            {skillFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Skill: {skillFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSkillFilter("")}
                />
              </Badge>
            )}
            {projectSkillFilter && (
              <Badge variant="default" className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600">
                Project: {projectSkillFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setProjectSkillFilter("")}
                />
              </Badge>
            )}
            {locationFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {locationFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setLocationFilter("")}
                />
              </Badge>
            )}
            {graduationYearFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Year: {graduationYearFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setGraduationYearFilter("")}
                />
              </Badge>
            )}
            {internshipTypeFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {internshipTypeFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setInternshipTypeFilter("")}
                />
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentFilters;
