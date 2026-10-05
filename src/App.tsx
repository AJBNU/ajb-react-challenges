import { useCourseSchedule } from './hooks/useCourseSchedule';

const App = () => {
  const { courses, isLoading, error } = useCourseSchedule();

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

  if (courses.length === 0) {
    return <main className="p-4">No courses are available.</main>;
  }

  return (
    <main className="min-h-screen bg-white p-0">
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 px-0 py-0">
        {courses.map((course) => (
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
    </main>
  );
};

export default App;