interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

const courses: Course[] = [
  {
    term: 'Fall',
    number: '101',
    meets: 'MWF 11:00-11:50',
    title: 'Computer Science: Concepts, Philosophy, and Connections',
  },
  {
    term: 'Fall',
    number: '110',
    meets: 'MWF 10:00-10:50',
    title: 'Intro Programming for non-majors',
  },
  {
    term: 'Fall',
    number: '111',
    meets: 'MWF 13:00-13:50',
    title: 'Fundamentals of Computer Programming I',
  },
  {
    term: 'Fall',
    number: '211',
    meets: 'MWF 12:30-13:50',
    title: 'Fundamentals of Computer Programming II',
  },
];

const App = () => {
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