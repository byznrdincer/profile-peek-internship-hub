
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface InternshipPreferencesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const InternshipPreferencesSection = ({ formData, setFormData }: InternshipPreferencesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Internship Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <p className="text-sm text-gray-600">
          Help recruiters understand your internship preferences.
        </p>
      </CardContent>
    </Card>
  );
};

export default InternshipPreferencesSection;
