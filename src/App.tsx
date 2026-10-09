import { useState } from 'react';

import { useCourseSchedule } from './hooks/useCourseSchedule';

const COURSE_TERMS = ['Fall', 'Winter', 'Spring'] as const;
type CourseTerm = (typeof COURSE_TERMS)[number];

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
        <fieldset className="mb-6">
          <legend className="mb-3 text-lg font-medium text-neutral-900">
            Filter by term
          </legend>
          <div className="flex flex-wrap gap-4">
            {COURSE_TERMS.map((term) => (
              <label
                key={term}
                className="flex cursor-pointer items-center gap-2 text-base text-neutral-900"
              >
                <input
                  type="radio"
                  name="course-term"
                  value={term}
                  checked={selectedTerm === term}
                  onChange={(event) => setSelectedTerm(event.target.value as CourseTerm)}
                />
                {term}
              </label>
            ))}
          </div>
        </fieldset>

        {filteredCourses.length === 0 ? (
          <p className="text-neutral-700">No {selectedTerm.toLowerCase()} courses are available.</p>
        ) : (
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {filteredCourses.map((course) => (
              <article
                key={`${course.term}-${course.number}`}
                className="flex min-h-[230px] flex-col justify-between border border-neutral-300 bg-white p-5 text-black"
              >
                <div>
                  <h2 className="mb-5 text-[1.9rem] font-medium leading-tight tracking-[-0.05em] text-neutral-900">
                    {course.term} CS {course.number}
                  </h2>
                  <p className="text-[1.05rem] leading-[1.35] tracking-[-0.02em] text-neutral-800">
                    {course.title}
                  </p>
                </div>

                <div className="mt-6 border-t border-neutral-300 pt-4 text-[1.05rem] tracking-[-0.02em] text-neutral-900">
                  {course.meets}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default App;