import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const LocationAutocomplete = ({ value, onChange, placeholder = "Enter location...", label }: LocationAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Common locations database (countries and major cities)
  const locationSuggestions = [
    // United States
    "New York, NY, USA", "Los Angeles, CA, USA", "Chicago, IL, USA", "Houston, TX, USA",
    "Phoenix, AZ, USA", "Philadelphia, PA, USA", "San Antonio, TX, USA", "San Diego, CA, USA",
    "Dallas, TX, USA", "San Jose, CA, USA", "Austin, TX, USA", "Jacksonville, FL, USA",
    "San Francisco, CA, USA", "Seattle, WA, USA", "Denver, CO, USA", "Washington, DC, USA",
    "Boston, MA, USA", "Atlanta, GA, USA", "Miami, FL, USA", "Detroit, MI, USA",
    
    // Canada
    "Toronto, ON, Canada", "Vancouver, BC, Canada", "Montreal, QC, Canada", "Calgary, AB, Canada",
    "Edmonton, AB, Canada", "Ottawa, ON, Canada", "Winnipeg, MB, Canada", "Quebec City, QC, Canada",
    
    // United Kingdom
    "London, UK", "Manchester, UK", "Birmingham, UK", "Leeds, UK", "Glasgow, UK",
    "Sheffield, UK", "Bradford, UK", "Liverpool, UK", "Edinburgh, UK", "Bristol, UK",
    
    // India
    "Mumbai, India", "Delhi, India", "Bangalore, India", "Hyderabad, India", "Chennai, India",
    "Kolkata, India", "Pune, India", "Ahmedabad, India", "Surat, India", "Jaipur, India",
    
    // Australia
    "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia",
    "Adelaide, Australia", "Gold Coast, Australia", "Newcastle, Australia", "Canberra, Australia",
    
    // Germany
    "Berlin, Germany", "Munich, Germany", "Hamburg, Germany", "Cologne, Germany",
    "Frankfurt, Germany", "Stuttgart, Germany", "Düsseldorf, Germany", "Leipzig, Germany",
    
    // France
    "Paris, France", "Lyon, France", "Marseille, France", "Toulouse, France",
    "Nice, France", "Nantes, France", "Montpellier, France", "Strasbourg, France",
    
    // Other major countries
    "Tokyo, Japan", "Osaka, Japan", "Beijing, China", "Shanghai, China", "Singapore",
    "Hong Kong", "Dubai, UAE", "Tel Aviv, Israel", "Amsterdam, Netherlands",
    "Stockholm, Sweden", "Copenhagen, Denmark", "Oslo, Norway", "Zurich, Switzerland",
    "Vienna, Austria", "Brussels, Belgium", "Rome, Italy", "Milan, Italy", "Madrid, Spain",
    "Barcelona, Spain", "Lisbon, Portugal", "Warsaw, Poland", "Prague, Czech Republic",
    "Budapest, Hungary", "Bucharest, Romania", "Sofia, Bulgaria", "Athens, Greece",
    "Istanbul, Turkey", "Moscow, Russia", "St. Petersburg, Russia", "Kiev, Ukraine",
    "São Paulo, Brazil", "Rio de Janeiro, Brazil", "Buenos Aires, Argentina",
    "Mexico City, Mexico", "Guadalajara, Mexico", "Santiago, Chile", "Lima, Peru",
    "Bogotá, Colombia", "Cairo, Egypt", "Lagos, Nigeria", "Johannesburg, South Africa",
    "Cape Town, South Africa", "Nairobi, Kenya", "Casablanca, Morocco",
    
    // Countries only
    "United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain",
    "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark",
    "Finland", "Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Greece",
    "Portugal", "Ireland", "Luxembourg", "Estonia", "Latvia", "Lithuania", "Slovenia",
    "Slovakia", "Croatia", "Serbia", "Bosnia and Herzegovina", "Montenegro", "Albania",
    "North Macedonia", "Moldova", "Ukraine", "Belarus", "Russia", "Turkey", "Cyprus",
    "Malta", "Iceland", "Liechtenstein", "Monaco", "San Marino", "Vatican City", "Andorra",
    "Australia", "New Zealand", "Japan", "South Korea", "China", "India", "Singapore",
    "Malaysia", "Thailand", "Indonesia", "Philippines", "Vietnam", "Cambodia", "Laos",
    "Myanmar", "Bangladesh", "Pakistan", "Afghanistan", "Nepal", "Bhutan", "Sri Lanka",
    "Maldives", "Iran", "Iraq", "Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain",
    "Oman", "Yemen", "Jordan", "Lebanon", "Syria", "Israel", "Palestine", "Egypt",
    "Libya", "Tunisia", "Algeria", "Morocco", "Sudan", "Ethiopia", "Kenya", "Uganda",
    "Tanzania", "Rwanda", "Burundi", "Democratic Republic of Congo", "Republic of Congo",
    "Central African Republic", "Chad", "Niger", "Nigeria", "Cameroon", "Equatorial Guinea",
    "Gabon", "São Tomé and Príncipe", "Ghana", "Togo", "Benin", "Burkina Faso", "Mali",
    "Senegal", "Gambia", "Guinea-Bissau", "Guinea", "Sierra Leone", "Liberia", "Ivory Coast",
    "South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia", "Malawi", "Mozambique",
    "Swaziland", "Lesotho", "Madagascar", "Mauritius", "Seychelles", "Comoros", "Djibouti",
    "Eritrea", "Somalia", "Brazil", "Argentina", "Chile", "Uruguay", "Paraguay", "Bolivia",
    "Peru", "Ecuador", "Colombia", "Venezuela", "Guyana", "Suriname", "French Guiana",
    "Mexico", "Guatemala", "Belize", "El Salvador", "Honduras", "Nicaragua", "Costa Rica",
    "Panama", "Cuba", "Jamaica", "Haiti", "Dominican Republic", "Puerto Rico", "Trinidad and Tobago",
    "Barbados", "Saint Lucia", "Saint Vincent and the Grenadines", "Grenada", "Antigua and Barbuda",
    "Saint Kitts and Nevis", "Dominica", "Bahamas"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = locationSuggestions.filter(location =>
        location.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (value.length > 0) {
      const filtered = locationSuggestions.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-0">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0 flex items-center gap-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-3 w-3 text-gray-400" />
                  {suggestion}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;
