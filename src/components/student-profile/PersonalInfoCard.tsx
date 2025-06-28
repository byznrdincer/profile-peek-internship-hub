import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, MapPinIcon, Banknote } from "lucide-react";

interface PersonalInfoCardProps {
  student: any;
}

const PersonalInfoCard = ({ student }: PersonalInfoCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-blue-600 mb-2">{student.name}</CardTitle>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {student.location || 'Location not specified'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Class of {student.graduation_year}
              </span>
            </div>
            <p className="text-lg text-gray-700 mt-2">{student.major}</p>
            <p className="text-sm text-gray-600 mt-1">{student.university}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {student.availability_status && (
                <Badge variant={student.availability_status === 'Available' ? 'default' : 'secondary'} className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {student.availability_status}
                </Badge>
              )}
              {hasPreferredLocations && (
                <div className="flex flex-wrap gap-2">
                  {student.preferred_locations.slice(0, 2).map((location: string, index: number) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {location}
                    </Badge>
                  ))}
                  {student.preferred_locations.length > 2 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      +{student.preferred_locations.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              {hasSingleLocation && !hasPreferredLocations && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  Prefers: {student.preferred_internship_location}
                </Badge>
              )}
              {student.open_to_relocate && (
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                  <MapPinIcon className="h-3 w-3" />
                  Open to Relocate
                </Badge>
              )}
              {student.internship_type_preference && (
                <Badge className={`flex items-center gap-1 text-white ${getInternshipTypeBadgeColor(student.internship_type_preference)}`}>
                  <Banknote className="h-3 w-3" />
                  {getInternshipTypeDisplay(student.internship_type_preference)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{student.bio}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              <strong>Phone:</strong> {student.phone}
            </p>
            {student.email && (
              <p className="text-sm text-gray-500">
                <strong>Email:</strong> {student.email}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
