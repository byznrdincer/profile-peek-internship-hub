
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface StudentFiltersProps {
  majorFilter: string;
  setMajorFilter: (value: string) => void;
  skillFilter: string;
  setSkillFilter: (value: string) => void;
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
  locationFilter,
  setLocationFilter,
  graduationYearFilter,
  setGraduationYearFilter,
  internshipTypeFilter,
  setInternshipTypeFilter,
  onClearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount
}: StudentFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Students
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="majorFilter">Major</Label>
            <Input
              id="majorFilter"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              placeholder="Computer Science, Engineering..."
            />
          </div>
          <div>
            <Label htmlFor="skillFilter">Skills</Label>
            <Input
              id="skillFilter"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="React, Python, ML..."
            />
          </div>
          <LocationAutocomplete
            value={locationFilter}
            onChange={setLocationFilter}
            placeholder="Filter by location..."
            label="Location"
          />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Select value={graduationYearFilter} onValueChange={setGraduationYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Any year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="internshipType">Internship Type</Label>
            <Select value={internshipTypeFilter} onValueChange={setInternshipTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="unpaid">Unpaid Only</SelectItem>
                <SelectItem value="both">Both Paid & Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Showing {filteredCount} of {totalCount} students</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentFilters;
