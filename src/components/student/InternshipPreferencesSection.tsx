
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <div className="grid md:grid-cols-2 gap-4">
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
          <div>
            <Label htmlFor="stipend_expectation">Stipend Expectation</Label>
            <Input
              id="stipend_expectation"
              value={formData.stipend_expectation}
              onChange={(e) => setFormData({...formData, stipend_expectation: e.target.value})}
              placeholder="e.g., $1000/month, Negotiable, Not applicable"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Help recruiters understand your internship preferences and expected compensation.
        </p>
      </CardContent>
    </Card>
  );
};

export default InternshipPreferencesSection;
