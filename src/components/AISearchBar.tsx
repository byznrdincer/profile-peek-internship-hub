
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISearchCriteria {
  skills: string[];
  projectTechnologies: string[];
  major: string;
  graduationYear: string;
  minProjects: string;
  searchTerm: string;
  projectSearchTerm: string;
}

interface AISearchBarProps {
  onSearchCriteria: (criteria: AISearchCriteria) => void;
  availableSkills: string[];
  availableProjectTechnologies: string[];
}

const AISearchBar = ({ onSearchCriteria, availableSkills, availableProjectTechnologies }: AISearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processAIQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          availableSkills,
          availableProjectTechnologies,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process AI query');
      }

      const aiCriteria = await response.json();
      
      // Apply the AI-generated search criteria
      onSearchCriteria(aiCriteria);
      
      toast({
        title: "AI search applied",
        description: "Found profiles matching your query",
      });
    } catch (error) {
      console.error('AI search error:', error);
      toast({
        title: "AI search failed",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processAIQuery();
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">AI-Powered Search</h3>
        </div>
        <p className="text-sm text-purple-600 mb-4">
          Describe what you're looking for in natural language. For example: "Find JavaScript developers with React experience graduating in 2025" or "Students with machine learning projects and Python skills"
        </p>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Find full-stack developers with at least 3 projects in React and Node.js..."
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <Button 
            onClick={processAIQuery}
            disabled={isLoading || !query.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Search
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISearchBar;
