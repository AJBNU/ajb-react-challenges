import { useState } from 'react';

import type { Course } from '../types/course';
import { CourseCard } from './CourseCard';

interface CourseSelectionListProps {
  courses: Course[];
}

export const CourseSelectionList = ({ courses }: CourseSelectionListProps) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());

  const toggleCourseSelection = (course: Course) => {
    const courseId = `${course.term}-${course.number}`;

    setSelectedCourseIds((currentSelection) => {
      const nextSelection = new Set(currentSelection);

      if (nextSelection.has(courseId)) {
        nextSelection.delete(courseId);
      } else {
        nextSelection.add(courseId);
      }

      return nextSelection;
    });
  };

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      {courses.map((course) => {
        const courseId = `${course.term}-${course.number}`;
        const isSelected = selectedCourseIds.has(courseId);

        return (
          <CourseCard
            key={courseId}
            course={course}
            isSelected={isSelected}
            onToggle={() => toggleCourseSelection(course)}
          />
        );
      })}
    </div>
  );
};
