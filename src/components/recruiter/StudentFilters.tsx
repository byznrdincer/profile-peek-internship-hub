
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
  graduationYearFilter: string[];
  setGraduationYearFilter: (value: string[]) => void;
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
  const graduationYearOptions = Array.from({ length: 16 }, (_, i) => {
    const year = 2015 + i;
    return year.toString();
  });

  const internshipTypes = [
    "paid",
    "unpaid",
    "both"
  ];

  const handleGraduationYearSelect = (year: string) => {
    if (!graduationYearFilter.includes(year)) {
      setGraduationYearFilter([...graduationYearFilter, year]);
    }
  };

  const handleRemoveGraduationYear = (yearToRemove: string) => {
    setGraduationYearFilter(graduationYearFilter.filter(year => year !== yearToRemove));
  };

  const getInternshipTypeDisplayName = (type: string) => {
    switch (type) {
      case 'paid':
        return 'Paid';
      case 'unpaid':
        return 'Unpaid';
      case 'both':
        return 'Both';
      default:
        return type;
    }
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Students
            </h3>
          </div>
          <div className="text-xs text-gray-600">
            {filteredCount} of {totalCount}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="major" className="text-sm font-medium">Major</Label>
            <Input
              id="major"
              placeholder="Filter by major..."
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="skill" className="text-sm font-medium">General Skills</Label>
            <Input
              id="skill"
              placeholder="python java react"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-blue-600 mt-1">
              Space/comma separated (matches any)
            </p>
          </div>

          <div>
            <Label htmlFor="projectSkill" className="text-sm font-medium">Project Search</Label>
            <Input
              id="projectSkill"
              placeholder="react node.js api"
              value={projectSkillFilter}
              onChange={(e) => setProjectSkillFilter(e.target.value)}
              className="mt-1 border-purple-200 focus:border-purple-400"
            />
            <p className="text-xs text-purple-600 mt-1">
              Searches tech, titles, descriptions
            </p>
          </div>

          <div>
            <LocationAutocomplete
              label="Preferred Location"
              value={locationFilter}
              onChange={setLocationFilter}
              placeholder="new york california"
            />
            <p className="text-xs text-gray-500 mt-1">
              Space/comma for multiple locations
            </p>
          </div>

          <div>
            <Label htmlFor="graduationYear" className="text-sm font-medium">Graduation Year</Label>
            <Select onValueChange={handleGraduationYearSelect}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select years" />
              </SelectTrigger>
              <SelectContent>
                {graduationYearOptions
                  .filter(year => !graduationYearFilter.includes(year))
                  .map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {graduationYearFilter.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {graduationYearFilter.map((year) => (
                  <Badge key={year} variant="secondary" className="flex items-center gap-1 text-xs">
                    {year}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveGraduationYear(year)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="internshipType" className="text-sm font-medium">Internship Preference</Label>
            <Select
              value={internshipTypeFilter}
              onValueChange={setInternshipTypeFilter}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                {internshipTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getInternshipTypeDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-xs h-7"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {majorFilter && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  Major: {majorFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setMajorFilter("")}
                  />
                </Badge>
              )}
              {skillFilter && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  Skill: {skillFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSkillFilter("")}
                  />
                </Badge>
              )}
              {projectSkillFilter && (
                <Badge variant="default" className="flex items-center gap-1 text-xs bg-purple-500 hover:bg-purple-600">
                  Project: {projectSkillFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setProjectSkillFilter("")}
                  />
                </Badge>
              )}
              {locationFilter && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  Location: {locationFilter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setLocationFilter("")}
                  />
                </Badge>
              )}
              {graduationYearFilter.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  Years: {graduationYearFilter.join(', ')}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setGraduationYearFilter([])}
                  />
                </Badge>
              )}
              {internshipTypeFilter && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  Type: {getInternshipTypeDisplayName(internshipTypeFilter)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setInternshipTypeFilter("")}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentFilters;
