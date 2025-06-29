export const calculateProfileCompletion = (student: any): number => {
  let completedFields = 0;
  const totalFields = 11; // Reduced from 12 since resume is now optional

  // Basic info (4 fields)
  if (student.name) completedFields++;
  if (student.bio) completedFields++;
  if (student.university) completedFields++;
  if (student.major) completedFields++;

  // Contact info (2 fields)
  if (student.phone) completedFields++;
  if (student.location) completedFields++;

  // Professional info (2 fields) - resume removed as required
  if (student.skills && student.skills.length > 0) completedFields++;
  if (student.projects && student.projects.length > 0) completedFields++;

  // Links (3 fields)
  if (student.github_url) completedFields++;
  if (student.linkedin_url) completedFields++;
  if (student.website_url) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

export const getCompletionColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getCompletionBadgeColor = (percentage: number): 'default' | 'secondary' | 'destructive' => {
  if (percentage >= 80) return 'default';
  if (percentage >= 60) return 'secondary';
  return 'destructive';
};
