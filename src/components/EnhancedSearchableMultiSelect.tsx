
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface EnhancedSearchableMultiSelectProps {
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
}

const EnhancedSearchableMultiSelect = ({
  options,
  selected,
  onSelectionChange,
  placeholder = "Search and select...",
  label
}: EnhancedSearchableMultiSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selected.includes(option)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!selected.includes(trimmedValue)) {
        onSelectionChange([...selected, trimmedValue]);
      }
      setInputValue("");
      setSearchTerm("");
      setShowDropdown(false);
    } else if (e.key === 'Backspace' && inputValue === "" && selected.length > 0) {
      // Remove last selected item when backspace is pressed on empty input
      onSelectionChange(selected.slice(0, -1));
    }
  };

  const addOption = (option: string) => {
    onSelectionChange([...selected, option]);
    setInputValue("");
    setSearchTerm("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeOption = (optionToRemove: string) => {
    onSelectionChange(selected.filter(option => option !== optionToRemove));
  };

  const addCustomOption = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !selected.includes(trimmedValue)) {
      onSelectionChange([...selected, trimmedValue]);
      setInputValue("");
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {label && <Label>{label}</Label>}
      
      {/* Selected items */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((item) => (
          <Badge key={item} variant="secondary" className="flex items-center gap-1">
            {item}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeOption(item)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {/* Input field */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full"
        />
        
        {inputValue.trim() && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={addCustomOption}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (filteredOptions.length > 0 || inputValue.trim()) && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {inputValue.trim() && !options.includes(inputValue.trim()) && !selected.includes(inputValue.trim()) && (
              <div
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                onClick={addCustomOption}
              >
                <span className="text-blue-600">Add "{inputValue.trim()}"</span>
              </div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => addOption(option)}
              >
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && !inputValue.trim() && (
              <div className="p-2 text-gray-500 text-sm">No options available</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchableMultiSelect;
