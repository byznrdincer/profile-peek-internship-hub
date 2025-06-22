
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bookmark, Building } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalStudents: number;
    totalViews: number;
    newProfiles: number;
  };
  bookmarkedCount: number;
}

const StatsCards = ({ stats, bookmarkedCount }: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Students</CardTitle>
          <Users className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-xs opacity-90">Available profiles</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Bookmarked</CardTitle>
          <Bookmark className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookmarkedCount}</div>
          <p className="text-xs opacity-90">Saved candidates</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">New Profiles</CardTitle>
          <Building className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newProfiles}</div>
          <p className="text-xs opacity-90">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
