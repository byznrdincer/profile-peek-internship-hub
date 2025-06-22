
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
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
  bookmarkedCount
}: StudentListProps) => {
  return (
    <Card>
      <CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No students found matching your criteria.</p>
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
