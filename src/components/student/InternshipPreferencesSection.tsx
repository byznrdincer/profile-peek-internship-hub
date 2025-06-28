
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, X, Plus } from "lucide-react";
import LocationAutocomplete from "@/components/LocationAutocomplete";

interface InternshipPreferencesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const InternshipPreferencesSection = ({ formData, setFormData }: InternshipPreferencesSectionProps) => {
  const addPreferredLocation = () => {
    const currentLocations = formData.preferred_locations || [];
    setFormData({
      ...formData, 
      preferred_locations: [...currentLocations, ""]
    });
  };

  const updatePreferredLocation = (index: number, value: string) => {
    const currentLocations = formData.preferred_locations || [];
    const updatedLocations = [...currentLocations];
    updatedLocations[index] = value;
    setFormData({
      ...formData, 
      preferred_locations: updatedLocations
    });
  };

  const removePreferredLocation = (index: number) => {
    const currentLocations = formData.preferred_locations || [];
    const updatedLocations = currentLocations.filter((_, i) => i !== index);
    setFormData({
      ...formData, 
      preferred_locations: updatedLocations
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Internship Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="internship_type_preference">Internship Type Preference</Label>
          <Select
            value={formData.internship_type_preference}
            onValueChange={(value) => setFormData({...formData, internship_type_preference: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid Internships Only</SelectItem>
              <SelectItem value="unpaid">Unpaid Internships Only</SelectItem>
              <SelectItem value="both">Both Paid & Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Preferences
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Preferred Internship Locations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPreferredLocation}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Location
              </Button>
            </div>

            {(formData.preferred_locations || []).map((location: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <LocationAutocomplete
                    label=""
                    value={location}
                    onChange={(value) => updatePreferredLocation(index, value)}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePreferredLocation(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {(!formData.preferred_locations || formData.preferred_locations.length === 0) && (
              <div className="text-sm text-gray-500 italic">
                No preferred locations added yet. Click "Add Location" to get started.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="open_to_relocate" className="text-base">
                Open to Relocate
              </Label>
              <p className="text-sm text-gray-600">
                I'm willing to relocate for the right internship opportunity
              </p>
            </div>
            <Switch
              id="open_to_relocate"
              checked={formData.open_to_relocate || false}
              onCheckedChange={(checked) => setFormData({...formData, open_to_relocate: checked})}
            />
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Help recruiters understand your internship and location preferences.
        </p>
      </CardContent>
    </Card>
  );
};

export default InternshipPreferencesSection;
