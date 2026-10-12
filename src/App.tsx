import { useState } from 'react';

import { CourseCard } from './components/CourseCard';
import { CourseTermFilter, type CourseTerm } from './components/CourseTermFilter';
import { useCourseSchedule } from './hooks/useCourseSchedule';

const COURSE_TERMS = ['Fall', 'Winter', 'Spring'] as const satisfies readonly CourseTerm[];

const App = () => {
  const { courses, isLoading, error } = useCourseSchedule();
  const [selectedTerm, setSelectedTerm] = useState<CourseTerm>('Fall');

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

  if (courses.length === 0) {
    return <main className="p-4">No courses are available.</main>;
  }

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-6xl">
        <CourseTermFilter
          terms={COURSE_TERMS}
          selectedTerm={selectedTerm}
          onSelectTerm={setSelectedTerm}
        />

        {filteredCourses.length === 0 ? (
          <p className="text-neutral-700">No {selectedTerm.toLowerCase()} courses are available.</p>
        ) : (
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={`${course.term}-${course.number}`}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default App;