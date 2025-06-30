
import { useState, useEffect } from "react";

export const useStudentFilters = (students: any[], bookmarkedStudents: any[], activeTab: string) => {
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  
  // Filter states
  const [majorFilter, setMajorFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [projectSkillFilter, setProjectSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [graduationYearFilter, setGraduationYearFilter] = useState<string[]>([]);
  const [internshipTypeFilter, setInternshipTypeFilter] = useState("");

  const applyFilters = () => {
    const currentStudents = activeTab === "bookmarks" ? bookmarkedStudents : students;
    
    console.log('Dashboard: Applying filters to', currentStudents.length, 'students for tab:', activeTab);
    
    let filtered = currentStudents.filter(student => {
      if (majorFilter && !student.major?.toLowerCase().includes(majorFilter.toLowerCase())) {
        return false;
      }

      if (skillFilter) {
        const studentSkills = student.skills || [];
        const searchTerms = skillFilter
          .split(/[,\s]+/)
          .map(term => term.trim().toLowerCase())
          .filter(term => term);
        
        const hasMatchingSkill = searchTerms.some(searchTerm => 
          studentSkills.some((studentSkill: string) => 
            studentSkill.toLowerCase().includes(searchTerm)
          )
        );
        
        if (!hasMatchingSkill) return false;
      }

      if (projectSkillFilter) {
        const projects = student.projects || [];
        const searchTerms = projectSkillFilter
          .split(/[,\s]+/)
          .map(term => term.trim().toLowerCase())
          .filter(term => term);
        
        const hasMatchingProject = searchTerms.some(searchTerm => 
          projects.some((project: any) => {
            if (project.title?.toLowerCase().includes(searchTerm)) {
              return true;
            }
            if (project.description?.toLowerCase().includes(searchTerm)) {
              return true;
            }
            if (project.technologies?.some((tech: string) => 
              tech.toLowerCase().includes(searchTerm)
            )) {
              return true;
            }
            return false;
          })
        );
        
        if (!hasMatchingProject) return false;
      }

      if (locationFilter) {
        const searchTerms = locationFilter
          .split(/[,\s]+/)
          .map(term => term.trim().toLowerCase())
          .filter(term => term);
        
        const hasMatchingLocation = searchTerms.some(searchTerm => {
          const currentLocationMatch = student.location?.toLowerCase().includes(searchTerm);
          const preferredLocationsMatch = student.preferred_locations?.some((loc: string) => 
            loc.toLowerCase().includes(searchTerm)
          );
          const singlePreferredLocationMatch = student.preferred_internship_location?.toLowerCase().includes(searchTerm);
          
          return currentLocationMatch || preferredLocationsMatch || singlePreferredLocationMatch;
        });
        
        if (!hasMatchingLocation) return false;
      }

      if (graduationYearFilter.length > 0 && !graduationYearFilter.includes(student.graduation_year)) {
        return false;
      }

      if (internshipTypeFilter) {
        const studentPreference = student.internship_type_preference;
        
        if (studentPreference === 'both') {
          // Always include students who are open to both
        } else if (internshipTypeFilter === 'both') {
          // Filter shows 'both' - include all students
        } else if (studentPreference !== internshipTypeFilter) {
          return false;
        }
      }

      return true;
    });

    console.log('Dashboard: Filtered to', filtered.length, 'students');
    setFilteredStudents(filtered);
  };

  const clearFilters = () => {
    setMajorFilter("");
    setSkillFilter("");
    setProjectSkillFilter("");
    setLocationFilter("");
    setGraduationYearFilter([]);
    setInternshipTypeFilter("");
  };

  const hasActiveFilters = Boolean(majorFilter || skillFilter || projectSkillFilter || locationFilter || graduationYearFilter.length > 0 || internshipTypeFilter);

  useEffect(() => {
    console.log('Dashboard: Applying filters. Active tab:', activeTab);
    console.log('Dashboard: Students count:', students.length);
    console.log('Dashboard: Bookmarked students count:', bookmarkedStudents.length);
    applyFilters();
  }, [students, bookmarkedStudents, activeTab, majorFilter, skillFilter, projectSkillFilter, locationFilter, graduationYearFilter, internshipTypeFilter]);

  return {
    filteredStudents,
    majorFilter,
    setMajorFilter,
    skillFilter,
    setSkillFilter,
    projectSkillFilter,
    setProjectSkillFilter,
    locationFilter,
    setLocationFilter,
    graduationYearFilter,
    setGraduationYearFilter,
    internshipTypeFilter,
    setInternshipTypeFilter,
    clearFilters,
    hasActiveFilters
  };
};
