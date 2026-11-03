export interface Course {
  id?: string;
  term: string;
  number: string;
  meets: string;
  title: string;
}

export const COURSE_TERMS = ['Fall', 'Winter', 'Spring', 'Summer'] as const;

export type CourseTerm = (typeof COURSE_TERMS)[number];

export interface CourseFieldErrors {
  title?: string;
  term?: string;
  number?: string;
  meets?: string;
}

export interface CourseFormResolverResult {
  values: Partial<Course>;
  errors: Record<string, { type: string; message: string }>;
}

export const CourseSchema: Record<keyof Omit<Course, 'id'>, (value: string) => boolean> = {
  title: (value: string) => value.trim().length >= 2,
  term: (value: string) => COURSE_TERMS.indexOf(value.trim() as CourseTerm) !== -1,
  number: (value: string) => /^\d{3}(?:-\d+)?$/.test(value.trim()),
  meets: (value: string) => value === '' || isValidMeetingTime(value),
};

const MEETING_PATTERN = /^((?:Tu|Th|Sa|Su|M|W|F)+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/;
const DAY_TOKENS = /Tu|Th|Sa|Su|M|W|F/g;

export const isValidCourseTitle = (value: string): boolean => value.trim().length >= 2;

export const isValidCourseTerm = (value: string): value is CourseTerm =>
  COURSE_TERMS.indexOf(value.trim() as CourseTerm) !== -1;

export const isValidCourseNumber = (value: string): boolean => /^\d{3}(?:-\d+)?$/.test(value.trim());

export const isValidMeetingTime = (value: string): boolean => {
  const trimmed = value.trim();

  if (trimmed === '') {
    return true;
  }

  const meetingMatch = MEETING_PATTERN.exec(trimmed);

  if (!meetingMatch) {
    return false;
  }

  const [, dayString, startValue, endValue] = meetingMatch;
  const dayMatches = dayString.match(DAY_TOKENS) ?? [];

  if (dayMatches.join('') !== dayString || new Set(dayMatches).size !== dayMatches.length) {
    return false;
  }

  const startMinutes = parseTime(startValue);
  const endMinutes = parseTime(endValue);

  return startMinutes < endMinutes;
};

const parseTime = (time: string): number => {
  const [hoursText, minutesText] = time.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return Number.POSITIVE_INFINITY;
  }

  return hours * 60 + minutes;
};

export const validateCourse = (course: Partial<Course>): CourseFieldErrors => {
  const errors: CourseFieldErrors = {};
  const title = course.title ?? '';
  const term = course.term ?? '';
  const number = course.number ?? '';
  const meets = course.meets ?? '';

  if (!CourseSchema.title(title)) {
    errors.title = 'must be at least two characters';
  }

  if (!CourseSchema.term(term)) {
    errors.term = 'must be Fall, Winter, Spring, or Summer';
  }

  if (!CourseSchema.number(number)) {
    errors.number = 'must be a number like 101 or 213-2';
  }

  if (!CourseSchema.meets(meets)) {
    errors.meets = 'must contain days and start-end, e.g., MWF 12:00-13:20';
  }

  return errors;
};

export const courseResolver = (values: Partial<Course>): CourseFormResolverResult => {
  const errors = validateCourse(values);

  const normalizedValues = {
    term: values.term?.trim() ?? '',
    number: values.number?.trim() ?? '',
    meets: values.meets?.trim() ?? '',
    title: values.title?.trim() ?? '',
  };

  const resolverErrors: Record<string, { type: string; message: string }> = {};

  for (const key of Object.keys(errors) as (keyof CourseFieldErrors)[]) {
    const message = errors[key];

    if (message) {
      resolverErrors[key] = { type: 'validate', message };
    }
  }

  return {
    values: normalizedValues,
    errors: resolverErrors,
  };
};
