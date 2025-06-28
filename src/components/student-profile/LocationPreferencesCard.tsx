
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon } from "lucide-react";

interface LocationPreferencesCardProps {
  student: any;
}

const LocationPreferencesCard = ({ student }: LocationPreferencesCardProps) => {
  const getInternshipTypeDisplay = (preference: string) => {
    switch (preference) {
      case 'paid':
        return 'Paid Only';
      case 'unpaid':
        return 'Unpaid Only';
      case 'both':
        return 'Both Paid & Unpaid';
      default:
        return 'Not specified';
    }
  };

  const getInternshipTypeBadgeColor = (preference: string) => {
    switch (preference) {
      case 'paid':
        return 'bg-green-500 hover:bg-green-600';
      case 'unpaid':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'both':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const hasPreferredLocations = student.preferred_locations && student.preferred_locations.length > 0;
  const hasSingleLocation = student.preferred_internship_location;

  if (!student.internship_type_preference && !hasPreferredLocations && !hasSingleLocation && !student.open_to_relocate) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          Location & Internship Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Location Preferences</h4>
            
            {hasPreferredLocations && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Preferred Locations</p>
                <div className="flex flex-wrap gap-2">
                  {student.preferred_locations.map((location: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {hasSingleLocation && !hasPreferredLocations && (
              <div>
                <p className="text-sm font-medium text-gray-600">Preferred Location</p>
                <p className="text-gray-900">{student.preferred_internship_location}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-600">Open to Relocate</p>
              <div className="flex items-center gap-2 mt-1">
                {student.open_to_relocate ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    Yes, willing to relocate
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Prefers current location
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Internship Preferences</h4>
            
            {student.internship_type_preference && (
              <div>
                <p className="text-sm font-medium text-gray-600">Internship Type</p>
                <Badge className={`mt-1 ${getInternshipTypeBadgeColor(student.internship_type_preference)} text-white`}>
                  {getInternshipTypeDisplay(student.internship_type_preference)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPreferencesCard;
