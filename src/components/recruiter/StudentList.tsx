
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import StudentCard from "./StudentCard";

interface StudentListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  filteredStudents: any[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onViewProfile: (student: any) => void;
  onBookmarkChange: () => void;
  studentsCount: number;
  bookmarkedCount: number;
  studentsLoaded: boolean;
  onLoadAllStudents: () => void;
}

const StudentList = ({
  activeTab,
  setActiveTab,
  loading,
  filteredStudents,
  hasActiveFilters,
  onClearFilters,
  onViewProfile,
  onBookmarkChange,
  studentsCount,
  bookmarkedCount,
  studentsLoaded,
  onLoadAllStudents
}: StudentListProps) => {
  const showEmptyState = activeTab === "all" && !studentsLoaded && !hasActiveFilters;

  const handleTabChange = (newTab: string) => {
    console.log('StudentList: Tab changing from', activeTab, 'to', newTab);
    console.log('StudentList: Current filtered students count:', filteredStudents.length);
    setActiveTab(newTab);
  };

  return (
    <Card>
      <CardHeader>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Students ({studentsCount})</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarked ({bookmarkedCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-sm text-gray-600 mt-2">
          Active users (logged in recently) are shown first
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student profiles...</p>
          </div>
        ) : showEmptyState ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Ready to find talented students?</h3>
            <p className="mb-6 max-w-md mx-auto">
              Use the filters above to search for students by major, skills, location, or project technologies. 
              Or browse all available student profiles.
            </p>
            <Button onClick={onLoadAllStudents} className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Browse All Students
            </Button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            {activeTab === "bookmarks" ? (
              <div>
                <p className="mb-2">No bookmarked students found.</p>
                {hasActiveFilters ? (
                  <p className="text-sm mb-4">Try clearing your filters to see all bookmarked students.</p>
                ) : (
                  <p className="text-sm mb-4">Start bookmarking students to see them here.</p>
                )}
              </div>
            ) : (
              <p>No students found matching your criteria.</p>
            )}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewProfile={onViewProfile}
                onBookmarkChange={onBookmarkChange}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;
