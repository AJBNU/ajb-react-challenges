import { useState } from 'react';

import { CoursePlanDialog } from './components/CoursePlanDialog';
import { CourseSelectionList } from './components/CourseSelectionList';
import { CourseTermFilter, type CourseTerm } from './components/CourseTermFilter';
import { useCourseSchedule } from './hooks/useCourseSchedule';
import type { Course } from './types/course';

const COURSE_TERMS = ['Fall', 'Winter', 'Spring'] as const satisfies readonly CourseTerm[];

const App = () => {
  const { courses, isLoading, error } = useCourseSchedule();
  const [selectedTerm, setSelectedTerm] = useState<CourseTerm>('Fall');
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isCoursePlanOpen, setIsCoursePlanOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="p-4" role="status">
        Loading courses...
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4" role="alert">
        Unable to load courses: {error}
      </main>
    );
  }

  const filteredCourses = courses.filter((course) => course.term === selectedTerm);

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <CourseTermFilter
            terms={COURSE_TERMS}
            selectedTerm={selectedTerm}
            onSelectTerm={setSelectedTerm}
          />
          <button
            type="button"
            onClick={() => setIsCoursePlanOpen(true)}
            className="shrink-0 border border-neutral-400 bg-white px-4 py-2 text-base text-neutral-900 hover:bg-neutral-100"
          >
            Course plan
          </button>
        </div>

        {courses.length === 0 ? (
          <p className="text-neutral-700">No courses are available.</p>
        ) : (
          <>
            {filteredCourses.length === 0 ? (
              <p className="text-neutral-700">
                No {selectedTerm.toLowerCase()} courses are available.
              </p>
            ) : null}
            <CourseSelectionList
              courses={filteredCourses}
              allCourses={courses}
              onSelectionChange={setSelectedCourses}
            />
          </>
        )}
      </div>
      {isCoursePlanOpen ? (
        <CoursePlanDialog
          courses={selectedCourses}
          onClose={() => setIsCoursePlanOpen(false)}
        />
      ) : null}
    </main>
  );
};

export default App;