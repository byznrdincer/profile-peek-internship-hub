import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface BookmarkButtonProps {
  studentId: string;
  className?: string;
  onBookmarkChange?: () => void; // Callback prop
}

const BookmarkButton = ({ studentId, className, onBookmarkChange }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkBookmarkStatus();
  }, [studentId, user]);

  const checkBookmarkStatus = async () => {
    if (!user) return;

    try {
      // Backend'den bookmark durumu al
      const res = await fetch(`/api/bookmarks/check/${studentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch bookmark status");
      const data = await res.json();
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (isBookmarked) {
        // Bookmark kaldır
        const res = await fetch(`/api/bookmarks/${studentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to remove bookmark");
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Student removed from your bookmarks",
        });
      } else {
        // Bookmark ekle
        const res = await fetch(`/api/bookmarks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
        if (!res.ok) throw new Error("Failed to add bookmark");
        setIsBookmarked(true);
        toast({
          title: "Student bookmarked",
          description: "Student added to your bookmarks",
        });
      }
      if (onBookmarkChange) onBookmarkChange();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleBookmark}
      disabled={loading}
      className={className}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};

export default BookmarkButton;
