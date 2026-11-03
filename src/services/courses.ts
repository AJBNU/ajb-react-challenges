import { get, ref, update } from 'firebase/database';

import { realtimeDatabase } from './firebase';
import type { Course } from '../types/course';

const isCourse = (value: unknown): value is Course => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'term' in value &&
    typeof value.term === 'string' &&
    'number' in value &&
    typeof value.number === 'string' &&
    'meets' in value &&
    typeof value.meets === 'string' &&
    'title' in value &&
    typeof value.title === 'string'
  );
};

const isCourseRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const fetchCourseSchedule = async (): Promise<Course[]> => {
  const snapshot = await get(ref(realtimeDatabase, 'courses'));
  const data: unknown = snapshot.val();

  if (!isCourseRecord(data)) {
    throw new Error('The Realtime Database does not contain course data.');
  }

  return Object.keys(data).map((courseId) => {
    const course = data[courseId];

    if (!isCourse(course)) {
      throw new Error('The Realtime Database contains invalid course data.');
    }

    return { ...course, id: courseId };
  });
};

export const updateCourse = async (
  originalCourse: Pick<Course, 'term' | 'number'> & { id?: string },
  course: Course,
): Promise<void> => {
  const coursesReference = ref(realtimeDatabase, 'courses');
  const snapshot = await get(coursesReference);
  const existingCourses: unknown = snapshot.val();

  if (!isCourseRecord(existingCourses)) {
    throw new Error('The course could not be found. Reload the schedule and try again.');
  }

  const referencedCourse = originalCourse.id ? existingCourses[originalCourse.id] : undefined;
  const matchingOriginalIds = Object.keys(existingCourses).filter((courseId) => {
    const existingCourse = existingCourses[courseId];

    return (
      isCourse(existingCourse) &&
      existingCourse.term === originalCourse.term &&
      existingCourse.number === originalCourse.number
    );
  });
  const originalCourseId =
    isCourse(referencedCourse)
      ? originalCourse.id
      : matchingOriginalIds.length === 1
        ? matchingOriginalIds[0]
        : undefined;

  if (!originalCourseId) {
    throw new Error(
      matchingOriginalIds.length > 1
        ? 'More than one course matches this edit. Reload the schedule and try again.'
        : 'The course could not be found. Reload the schedule and try again.',
    );
  }

  const hasDuplicate = Object.keys(existingCourses).some((existingId) => {
    const existingCourse = existingCourses[existingId];

    return (
      existingId !== originalCourseId &&
      isCourse(existingCourse) &&
      existingCourse.term === course.term &&
      existingCourse.number === course.number
    );
  });

  if (hasDuplicate) {
    throw new Error(`A ${course.term} course numbered ${course.number} already exists.`);
  }

  const { term, number, meets, title } = course;
  await update(ref(realtimeDatabase, `courses/${originalCourseId}`), {
    term,
    number,
    meets,
    title,
  });
};
