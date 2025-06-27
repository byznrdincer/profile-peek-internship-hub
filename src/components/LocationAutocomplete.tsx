
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
  disabled?: boolean;
}

const LocationAutocomplete = ({ value, onChange, placeholder = "Enter location...", label, disabled }: LocationAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Comprehensive worldwide cities database
  const locationSuggestions = [
    // Major United States Cities
    "New York, NY, USA", "Los Angeles, CA, USA", "Chicago, IL, USA", "Houston, TX, USA",
    "Phoenix, AZ, USA", "Philadelphia, PA, USA", "San Antonio, TX, USA", "San Diego, CA, USA",
    "Dallas, TX, USA", "San Jose, CA, USA", "Austin, TX, USA", "Jacksonville, FL, USA",
    "San Francisco, CA, USA", "Seattle, WA, USA", "Denver, CO, USA", "Washington, DC, USA",
    "Boston, MA, USA", "Atlanta, GA, USA", "Miami, FL, USA", "Detroit, MI, USA",
    "Nashville, TN, USA", "Portland, OR, USA", "Las Vegas, NV, USA", "Louisville, KY, USA",
    "Baltimore, MD, USA", "Milwaukee, WI, USA", "Albuquerque, NM, USA", "Tucson, AZ, USA",
    "Fresno, CA, USA", "Sacramento, CA, USA", "Mesa, AZ, USA", "Kansas City, MO, USA",
    "Cleveland, OH, USA", "Virginia Beach, VA, USA", "Omaha, NE, USA", "Miami Beach, FL, USA",
    "Oakland, CA, USA", "Minneapolis, MN, USA", "Tulsa, OK, USA", "Tampa, FL, USA",
    "New Orleans, LA, USA", "Wichita, KS, USA", "Arlington, TX, USA", "Bakersfield, CA, USA",

    // Canada
    "Toronto, ON, Canada", "Vancouver, BC, Canada", "Montreal, QC, Canada", "Calgary, AB, Canada",
    "Edmonton, AB, Canada", "Ottawa, ON, Canada", "Winnipeg, MB, Canada", "Quebec City, QC, Canada",
    "Hamilton, ON, Canada", "Kitchener, ON, Canada", "London, ON, Canada", "Victoria, BC, Canada",
    "Halifax, NS, Canada", "Oshawa, ON, Canada", "Windsor, ON, Canada", "Saskatoon, SK, Canada",
    "Regina, SK, Canada", "Barrie, ON, Canada", "Kelowna, BC, Canada", "Abbotsford, BC, Canada",

    // United Kingdom
    "London, UK", "Birmingham, UK", "Manchester, UK", "Leeds, UK", "Glasgow, UK",
    "Sheffield, UK", "Bradford, UK", "Liverpool, UK", "Edinburgh, UK", "Bristol, UK",
    "Cardiff, UK", "Leicester, UK", "Wakefield, UK", "Coventry, UK", "Nottingham, UK",
    "Newcastle upon Tyne, UK", "Belfast, UK", "Brighton, UK", "Hull, UK", "Plymouth, UK",
    "Stoke-on-Trent, UK", "Wolverhampton, UK", "Derby, UK", "Swansea, UK", "Southampton, UK",
    "Salford, UK", "Aberdeen, UK", "Westminster, UK", "Portsmouth, UK", "York, UK",

    // India
    "Mumbai, India", "Delhi, India", "Bangalore, India", "Hyderabad, India", "Chennai, India",
    "Kolkata, India", "Pune, India", "Ahmedabad, India", "Surat, India", "Jaipur, India",
    "Lucknow, India", "Kanpur, India", "Nagpur, India", "Indore, India", "Thane, India",
    "Bhopal, India", "Visakhapatnam, India", "Pimpri-Chinchwad, India", "Patna, India", "Vadodara, India",
    "Ghaziabad, India", "Ludhiana, India", "Agra, India", "Nashik, India", "Faridabad, India",
    "Meerut, India", "Rajkot, India", "Kalyan-Dombivali, India", "Vasai-Virar, India", "Varanasi, India",
    "Srinagar, India", "Aurangabad, India", "Dhanbad, India", "Amritsar, India", "Allahabad, India",
    "Ranchi, India", "Howrah, India", "Coimbatore, India", "Jabalpur, India", "Gwalior, India",

    // China
    "Shanghai, China", "Beijing, China", "Chongqing, China", "Tianjin, China", "Guangzhou, China",
    "Shenzhen, China", "Wuhan, China", "Dongguan, China", "Chengdu, China", "Nanjing, China",
    "Foshan, China", "Shenyang, China", "Hangzhou, China", "Xi'an, China", "Harbin, China",
    "Suzhou, China", "Qingdao, China", "Dalian, China", "Zhengzhou, China", "Shantou, China",
    "Jinan, China", "Changchun, China", "Kunming, China", "Changsha, China", "Taiyuan, China",
    "Xiamen, China", "Hefei, China", "Urumqi, China", "Fuzhou, China", "Wuxi, China",

    // Japan
    "Tokyo, Japan", "Yokohama, Japan", "Osaka, Japan", "Nagoya, Japan", "Sapporo, Japan",
    "Fukuoka, Japan", "Kobe, Japan", "Kawasaki, Japan", "Kyoto, Japan", "Saitama, Japan",
    "Hiroshima, Japan", "Sendai, Japan", "Kitakyushu, Japan", "Chiba, Japan", "Sakai, Japan",
    "Niigata, Japan", "Hamamatsu, Japan", "Okayama, Japan", "Sagamihara, Japan", "Kumamoto, Japan",

    // Australia
    "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia",
    "Adelaide, Australia", "Gold Coast, Australia", "Newcastle, Australia", "Canberra, Australia",
    "Sunshine Coast, Australia", "Wollongong, Australia", "Hobart, Australia", "Geelong, Australia",
    "Townsville, Australia", "Cairns, Australia", "Darwin, Australia", "Toowoomba, Australia",

    // Germany
    "Berlin, Germany", "Hamburg, Germany", "Munich, Germany", "Cologne, Germany",
    "Frankfurt am Main, Germany", "Stuttgart, Germany", "Düsseldorf, Germany", "Dortmund, Germany",
    "Essen, Germany", "Leipzig, Germany", "Bremen, Germany", "Dresden, Germany",
    "Hanover, Germany", "Nuremberg, Germany", "Duisburg, Germany", "Bochum, Germany",
    "Wuppertal, Germany", "Bielefeld, Germany", "Bonn, Germany", "Münster, Germany",

    // France
    "Paris, France", "Marseille, France", "Lyon, France", "Toulouse, France",
    "Nice, France", "Nantes, France", "Strasbourg, France", "Montpellier, France",
    "Bordeaux, France", "Lille, France", "Rennes, France", "Reims, France",
    "Le Havre, France", "Saint-Étienne, France", "Toulon, France", "Angers, France",
    "Grenoble, France", "Dijon, France", "Nîmes, France", "Aix-en-Provence, France",

    // Brazil
    "São Paulo, Brazil", "Rio de Janeiro, Brazil", "Brasília, Brazil", "Salvador, Brazil",
    "Fortaleza, Brazil", "Belo Horizonte, Brazil", "Manaus, Brazil", "Curitiba, Brazil",
    "Recife, Brazil", "Porto Alegre, Brazil", "Belém, Brazil", "Goiânia, Brazil",
    "Guarulhos, Brazil", "Campinas, Brazil", "São Luís, Brazil", "São Gonçalo, Brazil",
    "Maceió, Brazil", "Duque de Caxias, Brazil", "Teresina, Brazil", "Natal, Brazil",

    // Russia
    "Moscow, Russia", "Saint Petersburg, Russia", "Novosibirsk, Russia", "Yekaterinburg, Russia",
    "Nizhny Novgorod, Russia", "Kazan, Russia", "Chelyabinsk, Russia", "Omsk, Russia",
    "Samara, Russia", "Rostov-on-Don, Russia", "Ufa, Russia", "Krasnoyarsk, Russia",
    "Perm, Russia", "Voronezh, Russia", "Volgograd, Russia", "Krasnodar, Russia",

    // Mexico
    "Mexico City, Mexico", "Guadalajara, Mexico", "Monterrey, Mexico", "Puebla, Mexico",
    "Tijuana, Mexico", "León, Mexico", "Juárez, Mexico", "Torreón, Mexico",
    "Querétaro, Mexico", "San Luis Potosí, Mexico", "Mérida, Mexico", "Mexicali, Mexico",
    "Aguascalientes, Mexico", "Cuernavaca, Mexico", "Saltillo, Mexico", "Hermosillo, Mexico",

    // South Korea
    "Seoul, South Korea", "Busan, South Korea", "Incheon, South Korea", "Daegu, South Korea",
    "Daejeon, South Korea", "Gwangju, South Korea", "Suwon, South Korea", "Ulsan, South Korea",
    "Changwon, South Korea", "Goyang, South Korea", "Yongin, South Korea", "Seongnam, South Korea",

    // Indonesia
    "Jakarta, Indonesia", "Surabaya, Indonesia", "Bandung, Indonesia", "Bekasi, Indonesia",
    "Medan, Indonesia", "Tangerang, Indonesia", "Depok, Indonesia", "Semarang, Indonesia",
    "Palembang, Indonesia", "Makassar, Indonesia", "South Tangerang, Indonesia", "Batam, Indonesia",

    // Turkey
    "Istanbul, Turkey", "Ankara, Turkey", "Izmir, Turkey", "Bursa, Turkey",
    "Antalya, Turkey", "Adana, Turkey", "Konya, Turkey", "Gaziantep, Turkey",
    "Mersin, Turkey", "Diyarbakır, Turkey", "Kayseri, Turkey", "Eskişehir, Turkey",

    // Argentina
    "Buenos Aires, Argentina", "Córdoba, Argentina", "Rosario, Argentina", "Mendoza, Argentina",
    "Tucmán, Argentina", "La Plata, Argentina", "Mar del Plata, Argentina", "Salta, Argentina",
    "Santa Fe, Argentina", "San Juan, Argentina", "Resistencia, Argentina", "Santiago del Estero, Argentina",

    // South Africa
    "Johannesburg, South Africa", "Cape Town, South Africa", "Durban, South Africa", "Pretoria, South Africa",
    "Port Elizabeth, South Africa", "Pietermaritzburg, South Africa", "Benoni, South Africa", "Tembisa, South Africa",
    "East London, South Africa", "Vereeniging, South Africa", "Bloemfontein, South Africa", "Boksburg, South Africa",

    // Nigeria
    "Lagos, Nigeria", "Kano, Nigeria", "Ibadan, Nigeria", "Kaduna, Nigeria",
    "Port Harcourt, Nigeria", "Benin City, Nigeria", "Maiduguri, Nigeria", "Zaria, Nigeria",
    "Aba, Nigeria", "Jos, Nigeria", "Ilorin, Nigeria", "Oyo, Nigeria",

    // Egypt
    "Cairo, Egypt", "Alexandria, Egypt", "Giza, Egypt", "Shubra El-Kheima, Egypt",
    "Port Said, Egypt", "Suez, Egypt", "Luxor, Egypt", "Mansoura, Egypt",
    "El-Mahalla El-Kubra, Egypt", "Tanta, Egypt", "Asyut, Egypt", "Ismailia, Egypt",

    // Thailand
    "Bangkok, Thailand", "Nonthaburi, Thailand", "Pak Kret, Thailand", "Hat Yai, Thailand",
    "Chiang Mai, Thailand", "Phuket, Thailand", "Pattaya, Thailand", "Nakhon Ratchasima, Thailand",
    "Udon Thani, Thailand", "Surat Thani, Thailand", "Khon Kaen, Thailand", "Nakhon Si Thammarat, Thailand",

    // Philippines
    "Manila, Philippines", "Quezon City, Philippines", "Caloocan, Philippines", "Davao City, Philippines",
    "Cebu City, Philippines", "Zamboanga City, Philippines", "Antipolo, Philippines", "Pasig, Philippines",
    "Taguig, Philippines", "Valenzuela, Philippines", "Dasmariñas, Philippines", "Calamba, Philippines",

    // Vietnam
    "Ho Chi Minh City, Vietnam", "Hanoi, Vietnam", "Haiphong, Vietnam", "Da Nang, Vietnam",
    "Bien Hoa, Vietnam", "Hue, Vietnam", "Nha Trang, Vietnam", "Can Tho, Vietnam",
    "Rach Gia, Vietnam", "Qui Nhon, Vietnam", "Vung Tau, Vietnam", "Nam Dinh, Vietnam",

    // Malaysia
    "Kuala Lumpur, Malaysia", "George Town, Malaysia", "Ipoh, Malaysia", "Shah Alam, Malaysia",
    "Petaling Jaya, Malaysia", "Johor Bahru, Malaysia", "Seremban, Malaysia", "Kuching, Malaysia",
    "Kota Kinabalu, Malaysia", "Klang, Malaysia", "Kajang, Malaysia", "Selayang, Malaysia",

    // Singapore
    "Singapore",

    // Netherlands
    "Amsterdam, Netherlands", "Rotterdam, Netherlands", "The Hague, Netherlands", "Utrecht, Netherlands",
    "Eindhoven, Netherlands", "Tilburg, Netherlands", "Groningen, Netherlands", "Almere, Netherlands",
    "Breda, Netherlands", "Nijmegen, Netherlands", "Enschede, Netherlands", "Haarlem, Netherlands",

    // Belgium
    "Brussels, Belgium", "Antwerp, Belgium", "Ghent, Belgium", "Charleroi, Belgium",
    "Liège, Belgium", "Bruges, Belgium", "Namur, Belgium", "Leuven, Belgium",
    "Mons, Belgium", "Aalst, Belgium", "Mechelen, Belgium", "La Louvière, Belgium",

    // Italy
    "Rome, Italy", "Milan, Italy", "Naples, Italy", "Turin, Italy",
    "Palermo, Italy", "Genoa, Italy", "Bologna, Italy", "Florence, Italy",
    "Bari, Italy", "Catania, Italy", "Venice, Italy", "Verona, Italy",

    // Spain
    "Madrid, Spain", "Barcelona, Spain", "Valencia, Spain", "Seville, Spain",
    "Zaragoza, Spain", "Málaga, Spain", "Murcia, Spain", "Palma, Spain",
    "Las Palmas, Spain", "Bilbao, Spain", "Alicante, Spain", "Córdoba, Spain",

    // Poland
    "Warsaw, Poland", "Kraków, Poland", "Łódź, Poland", "Wrocław, Poland",
    "Poznań, Poland", "Gdańsk, Poland", "Szczecin, Poland", "Bydgoszcz, Poland",
    "Lublin, Poland", "Katowice, Poland", "Białystok, Poland", "Gdynia, Poland",

    // Ukraine
    "Kyiv, Ukraine", "Kharkiv, Ukraine", "Odesa, Ukraine", "Dnipro, Ukraine",
    "Donetsk, Ukraine", "Zaporizhzhia, Ukraine", "Lviv, Ukraine", "Kryvyi Rih, Ukraine",
    "Mykolaiv, Ukraine", "Mariupol, Ukraine", "Luhansk, Ukraine", "Vinnytsya, Ukraine",

    // Czech Republic
    "Prague, Czech Republic", "Brno, Czech Republic", "Ostrava, Czech Republic", "Plzen, Czech Republic",
    "Liberec, Czech Republic", "Olomouc, Czech Republic", "Budweis, Czech Republic", "Hradec Králové, Czech Republic",

    // Sweden
    "Stockholm, Sweden", "Gothenburg, Sweden", "Malmö, Sweden", "Uppsala, Sweden",
    "Västerås, Sweden", "Örebro, Sweden", "Linköping, Sweden", "Helsingborg, Sweden",
    "Jönköping, Sweden", "Norrköping, Sweden", "Lund, Sweden", "Umeå, Sweden",

    // Norway
    "Oslo, Norway", "Bergen, Norway", "Stavanger, Norway", "Trondheim, Norway",
    "Drammen, Norway", "Fredrikstad, Norway", "Kristiansand, Norway", "Sandnes, Norway",
    "Tromsø, Norway", "Sarpsborg, Norway", "Skien, Norway", "Ålesund, Norway",

    // Denmark
    "Copenhagen, Denmark", "Aarhus, Denmark", "Odense, Denmark", "Aalborg, Denmark",
    "Esbjerg, Denmark", "Randers, Denmark", "Kolding, Denmark", "Horsens, Denmark",
    "Vejle, Denmark", "Roskilde, Denmark", "Herning, Denmark", "Silkeborg, Denmark",

    // Finland
    "Helsinki, Finland", "Espoo, Finland", "Tampere, Finland", "Vantaa, Finland",
    "Oulu, Finland", "Turku, Finland", "Jyväskylä, Finland", "Lahti, Finland",
    "Kuopio, Finland", "Pori, Finland", "Joensuu, Finland", "Lappeenranta, Finland",

    // Switzerland
    "Zurich, Switzerland", "Geneva, Switzerland", "Basel, Switzerland", "Lausanne, Switzerland",
    "Bern, Switzerland", "Winterthur, Switzerland", "Lucerne, Switzerland", "St. Gallen, Switzerland",
    "Lugano, Switzerland", "Biel/Bienne, Switzerland", "Thun, Switzerland", "Köniz, Switzerland",

    // Austria
    "Vienna, Austria", "Graz, Austria", "Linz, Austria", "Salzburg, Austria",
    "Innsbruck, Austria", "Klagenfurt, Austria", "Villach, Austria", "Wels, Austria",
    "Sankt Pölten, Austria", "Dornbirn, Austria", "Steyr, Austria", "Wiener Neustadt, Austria",

    // Portugal
    "Lisbon, Portugal", "Porto, Portugal", "Vila Nova de Gaia, Portugal", "Amadora, Portugal",
    "Braga, Portugal", "Funchal, Portugal", "Coimbra, Portugal", "Setúbal, Portugal",
    "Almada, Portugal", "Agualva-Cacém, Portugal", "Queluz, Portugal", "Rio Tinto, Portugal",

    // Greece
    "Athens, Greece", "Thessaloniki, Greece", "Patras, Greece", "Piraeus, Greece",
    "Larissa, Greece", "Heraklion, Greece", "Peristeri, Greece", "Kallithea, Greece",
    "Acharnes, Greece", "Kalamaria, Greece", "Nikaia, Greece", "Glyfada, Greece",

    // Ireland
    "Dublin, Ireland", "Cork, Ireland", "Limerick, Ireland", "Galway, Ireland",
    "Waterford, Ireland", "Drogheda, Ireland", "Dundalk, Ireland", "Swords, Ireland",
    "Bray, Ireland", "Navan, Ireland", "Ennis, Ireland", "Tralee, Ireland",

    // Chile
    "Santiago, Chile", "Valparaíso, Chile", "Concepción, Chile", "La Serena, Chile",
    "Antofagasta, Chile", "Temuco, Chile", "Rancagua, Chile", "Talca, Chile",
    "Arica, Chile", "Chillán, Chile", "Iquique, Chile", "Los Angeles, Chile",

    // Peru
    "Lima, Peru", "Arequipa, Peru", "Trujillo, Peru", "Chiclayo, Peru",
    "Huancayo, Peru", "Piura, Peru", "Iquitos, Peru", "Cusco, Peru",
    "Chimbote, Peru", "Tacna, Peru", "Juliaca, Peru", "Ica, Peru",

    // Colombia
    "Bogotá, Colombia", "Medellín, Colombia", "Cali, Colombia", "Barranquilla, Colombia",
    "Cartagena, Colombia", "Cúcuta, Colombia", "Bucaramanga, Colombia", "Pereira, Colombia",
    "Santa Marta, Colombia", "Ibagué, Colombia", "Pasto, Colombia", "Manizales, Colombia",

    // Venezuela
    "Caracas, Venezuela", "Maracaibo, Venezuela", "Valencia, Venezuela", "Barquisimeto, Venezuela",
    "Maracay, Venezuela", "Ciudad Guayana, Venezuela", "San Cristóbal, Venezuela", "Maturín, Venezuela",
    "Barcelona, Venezuela", "Turmero, Venezuela", "Ciudad Bolívar, Venezuela", "Mérida, Venezuela",

    // Ecuador
    "Quito, Ecuador", "Guayaquil, Ecuador", "Cuenca, Ecuador", "Santo Domingo, Ecuador",
    "Machala, Ecuador", "Durán, Ecuador", "Manta, Ecuador", "Portoviejo, Ecuador",
    "Ambato, Ecuador", "Riobamba, Ecuador", "Loja, Ecuador", "Esmeraldas, Ecuador",

    // Uruguay
    "Montevideo, Uruguay", "Salto, Uruguay", "Paysandú, Uruguay", "Las Piedras, Uruguay",
    "Rivera, Uruguay", "Maldonado, Uruguay", "Tacuarembó, Uruguay", "Melo, Uruguay",
    "Mercedes, Uruguay", "Artigas, Uruguay", "Minas, Uruguay", "San José de Mayo, Uruguay",

    // Paraguay
    "Asunción, Paraguay", "Ciudad del Este, Paraguay", "San Lorenzo, Paraguay", "Luque, Paraguay",
    "Capiatá, Paraguay", "Lambaré, Paraguay", "Fernando de la Mora, Paraguay", "Limpio, Paraguay",
    "Ñemby, Paraguay", "Encarnación, Paraguay", "Mariano Roque Alonso, Paraguay", "Pedro Juan Caballero, Paraguay",

    // Bolivia
    "La Paz, Bolivia", "Santa Cruz de la Sierra, Bolivia", "Cochabamba, Bolivia", "Sucre, Bolivia",
    "Oruro, Bolivia", "Tarija, Bolivia", "Potosí, Bolivia", "Sacaba, Bolivia",
    "Quillacollo, Bolivia", "Montero, Bolivia", "Trinidad, Bolivia", "El Alto, Bolivia",

    // Countries (for broader search)
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
    "Eswatini", "Lesotho", "Madagascar", "Mauritius", "Seychelles", "Comoros", "Djibouti",
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
      ).slice(0, 15); // Increased to 15 suggestions for better coverage
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
      ).slice(0, 15);
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
            disabled={disabled}
          />
        </div>
        
        {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
          <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border shadow-lg">
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
