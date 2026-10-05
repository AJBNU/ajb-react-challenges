import type { Course, CourseScheduleResponse } from '../types/course';

const COURSE_SCHEDULE_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php';

export const fetchCourseSchedule = async (): Promise<Course[]> => {
  const response = await fetch(COURSE_SCHEDULE_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch course schedule: ${response.status}`);
  }

  const data = (await response.json()) as CourseScheduleResponse;
  const scheduleId = Object.keys(data.schedules)[0];

  if (!scheduleId) {
    throw new Error('The course schedule response did not contain a schedule.');
  }

  const schedule = data.schedules[scheduleId];
  return Object.keys(schedule.courses).map((courseId) => schedule.courses[courseId]);
};
