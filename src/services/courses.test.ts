import { get, ref } from 'firebase/database';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCourseSchedule } from './courses';
import { realtimeDatabase } from './firebase';
import type { Course } from '../types/course';

vi.mock('firebase/database', () => ({
  get: vi.fn(),
  ref: vi.fn(),
}));

vi.mock('./firebase', () => ({
  realtimeDatabase: {},
}));

const courses: Record<string, Course> = {
  F101: { term: 'Fall', number: '101', meets: 'MWF 11:00-11:50', title: 'Intro' },
  W201: { term: 'Winter', number: '201', meets: 'TR 10:00-11:20', title: 'Advanced' },
};

describe('fetchCourseSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ref).mockReturnValue(undefined as never);
  });

  it('loads and returns course records from the Realtime Database', async () => {
    vi.mocked(get).mockResolvedValue({
      val: () => courses,
    } as Awaited<ReturnType<typeof get>>);

    await expect(fetchCourseSchedule()).resolves.toEqual(
      Object.keys(courses).map((courseId) => courses[courseId]),
    );
    expect(ref).toHaveBeenCalledWith(realtimeDatabase, 'courses');
  });

  it('throws when no course data is present', async () => {
    vi.mocked(get).mockResolvedValue({
      val: () => null,
    } as Awaited<ReturnType<typeof get>>);

    await expect(fetchCourseSchedule()).rejects.toThrow(
      'The Realtime Database does not contain course data.',
    );
  });

  it('throws when a course record does not match the expected shape', async () => {
    vi.mocked(get).mockResolvedValue({
      val: () => ({ F101: { number: '101' } }),
    } as Awaited<ReturnType<typeof get>>);

    await expect(fetchCourseSchedule()).rejects.toThrow(
      'The Realtime Database contains invalid course data.',
    );
  });
});
