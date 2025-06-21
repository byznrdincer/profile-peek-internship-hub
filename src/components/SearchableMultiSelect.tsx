
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, ChevronDown, Plus } from "lucide-react";

interface SearchableMultiSelectProps {
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder: string;
  label: string;
}

const SearchableMultiSelect = ({
  options,
  selected,
  onSelectionChange,
  placeholder,
  label
}: SearchableMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selected.includes(option)
  );

  const handleOptionClick = (option: string) => {
    onSelectionChange([...selected, option]);
  };

  const handleRemoveOption = (option: string) => {
    onSelectionChange(selected.filter(item => item !== option));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleAddCustomSkill = () => {
    const trimmedSkill = searchTerm.trim();
    if (trimmedSkill && !selected.includes(trimmedSkill) && !options.includes(trimmedSkill)) {
      onSelectionChange([...selected, trimmedSkill]);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedSkill = searchTerm.trim();
      if (trimmedSkill && !selected.includes(trimmedSkill)) {
        // If it's not in the predefined options, add it as a custom skill
        if (!options.includes(trimmedSkill)) {
          handleAddCustomSkill();
        } else {
          // If it exists in options, select it
          handleOptionClick(trimmedSkill);
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          {selected.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {selected.length === 0 ? placeholder : `${selected.length} selected`}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selected.map(item => (
              <Badge
                key={item}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemoveOption(item)}
              >
                {item}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-hidden bg-white border shadow-lg">
          <CardContent className="p-2">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search or add custom ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-8"
                autoFocus
              />
            </div>
            
            <div className="max-h-40 overflow-y-auto">
              {/* Show custom skill option if search term doesn't match any existing options */}
              {searchTerm.trim() && 
               !options.some(option => option.toLowerCase() === searchTerm.toLowerCase()) && 
               !selected.includes(searchTerm.trim()) && (
                <div
                  className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground border-b border-gray-100 bg-blue-50 text-blue-700"
                  onClick={handleAddCustomSkill}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-3 w-3" />
                    <span>Add "{searchTerm.trim()}" as custom skill</span>
                  </div>
                </div>
              )}
              
              {filteredOptions.length === 0 && !searchTerm.trim() ? (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No more options available
                </div>
              ) : filteredOptions.length === 0 && searchTerm.trim() ? (
                <div className="text-sm text-muted-foreground text-center py-2">
                  {!options.some(option => option.toLowerCase() === searchTerm.toLowerCase()) 
                    ? "Press Enter or click above to add as custom skill"
                    : "No matching options found"}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map(option => (
                    <div
                      key={option}
                      className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchableMultiSelect;
