import { useState } from 'react';

import { hasTimeConflict } from '../utilities/courseConflicts.js';
import type { Course } from '../types/course';
import { CourseCard } from './CourseCard';

interface CourseSelectionListProps {
  courses: Course[];
  allCourses: Course[];
  onSelectionChange: (courses: Course[]) => void;
}

export const CourseSelectionList = ({
  courses,
  allCourses,
  onSelectionChange,
}: CourseSelectionListProps) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());

  const toggleCourseSelection = (course: Course) => {
    const courseId = `${course.term}-${course.number}`;

    const nextSelection = new Set(selectedCourseIds);

    if (nextSelection.has(courseId)) {
      nextSelection.delete(courseId);
    } else {
      nextSelection.add(courseId);
    }

    setSelectedCourseIds(nextSelection);
    onSelectionChange(
      allCourses.filter((allCourse) => nextSelection.has(`${allCourse.term}-${allCourse.number}`)),
    );
  };

  const selectedCourses = allCourses.filter((course) =>
    selectedCourseIds.has(`${course.term}-${course.number}`),
  );

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      {courses.map((course) => {
        const courseId = `${course.term}-${course.number}`;
        const isSelected = selectedCourseIds.has(courseId);
        const isSelectable =
          isSelected ||
          !selectedCourses.some((selectedCourse) => hasTimeConflict(course, selectedCourse));

        return (
          <CourseCard
            key={courseId}
            course={course}
            isSelected={isSelected}
            isSelectable={isSelectable}
            onToggle={() => toggleCourseSelection(course)}
          />
        );
      })}
    </div>
  );
};
