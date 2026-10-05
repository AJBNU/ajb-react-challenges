export interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

export interface CourseSchedule {
  title: string;
  courses: Record<string, Course>;
}

export interface CourseScheduleResponse {
  schedules: Record<string, CourseSchedule>;
}
