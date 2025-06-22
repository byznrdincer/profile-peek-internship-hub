
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface BookmarkButtonProps {
  studentId: string;
  className?: string;
}

const BookmarkButton = ({ studentId, className }: BookmarkButtonProps) => {
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
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (recruiterProfile) {
        const { data } = await supabase
          .from('student_bookmarks')
          .select('id')
          .eq('recruiter_id', recruiterProfile.id)
          .eq('student_user_id', studentId)
          .single();

        setIsBookmarked(!!data);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!recruiterProfile) {
        throw new Error('Recruiter profile not found');
      }

      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('student_bookmarks')
          .delete()
          .eq('recruiter_id', recruiterProfile.id)
          .eq('student_user_id', studentId);

        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Student removed from your bookmarks",
        });
      } else {
        // Add bookmark
        await supabase
          .from('student_bookmarks')
          .insert({
            recruiter_id: recruiterProfile.id,
            student_user_id: studentId
          });

        setIsBookmarked(true);
        toast({
          title: "Student bookmarked",
          description: "Student added to your bookmarks",
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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
