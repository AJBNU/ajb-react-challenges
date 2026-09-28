import './App.css';

interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

interface Schedule {
  title: string;
  courses: Record<string, Course>;
}

const schedules: Record<string, Schedule> = {
  'CS-2018-2019': {
    title: 'CS Courses for 2018-2019',
    courses: {
      F101: {
        term: 'Fall',
        number: '101',
        meets: 'MWF 11:00-11:50',
        title: 'Computer Science: Concepts, Philosophy, and Connections',
      },
      F110: {
        term: 'Fall',
        number: '110',
        meets: 'MWF 10:00-10:50',
        title: 'Intro Programming for non-majors',
      },
      S313: {
        term: 'Spring',
        number: '313',
        meets: 'TuTh 15:30-16:50',
        title: 'Tangible Interaction Design and Learning',
      },
      S314: {
        term: 'Spring',
        number: '314',
        meets: 'TuTh 9:30-10:50',
        title: 'Tech & Human Interaction',
      },
    },
  },
};

const App = () => {
  const schedule = schedules['CS-2018-2019'];

  return (
    <main className="schedule-page">
      <h1>{schedule.title}</h1>
      <div className="schedule-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Term</th>
              <th scope="col">Meets</th>
              <th scope="col">Title</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(schedule.courses).map((courseId) => {
              const course = schedule.courses[courseId];

              return (
                <tr key={courseId}>
                  <th scope="row">CS {course.number}</th>
                  <td>{course.term}</td>
                  <td>{course.meets}</td>
                  <td>{course.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default App;