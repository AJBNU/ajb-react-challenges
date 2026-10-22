import { get, ref } from 'firebase/database';

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

  const courses = Object.keys(data).map((courseId) => data[courseId]);

  if (!courses.every(isCourse)) {
    throw new Error('The Realtime Database contains invalid course data.');
  }

  return courses;
};
