import { get, ref, update } from 'firebase/database';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCourseSchedule, updateCourse } from './courses';
import { realtimeDatabase } from './firebase';
import type { Course } from '../types/course';

vi.mock('firebase/database', () => ({
  get: vi.fn(),
  ref: vi.fn(),
  update: vi.fn(),
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
      Object.keys(courses).map((courseId) => ({ ...courses[courseId], id: courseId })),
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

describe('updateCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ref).mockReturnValue(undefined as never);
    vi.mocked(get).mockResolvedValue({
      val: () => courses,
    } as Awaited<ReturnType<typeof get>>);
  });

  it('updates the existing record without changing its database key', async () => {
    const updatedCourse = { ...courses.F101, term: 'Winter', number: '202' };
    vi.mocked(update).mockResolvedValue(undefined);

    await updateCourse({ id: 'F101', term: 'Fall', number: '101' }, updatedCourse);

    expect(ref).toHaveBeenCalledWith(realtimeDatabase, 'courses');
    expect(ref).toHaveBeenCalledWith(realtimeDatabase, 'courses/F101');
    expect(update).toHaveBeenCalledWith(undefined, {
      term: 'Winter',
      number: '202',
      meets: 'MWF 11:00-11:50',
      title: 'Intro',
    });
  });

  it('rejects a course number already used in the same term', async () => {
    const currentCourses = {
      ...courses,
      F102: { ...courses.F101, number: '102' },
    };
    vi.mocked(get).mockResolvedValue({
      val: () => currentCourses,
    } as Awaited<ReturnType<typeof get>>);

    await expect(
      updateCourse(
        { id: 'F101', term: 'Fall', number: '101' },
        { ...courses.F101, number: '102' },
      ),
    ).rejects.toThrow('A Fall course numbered 102 already exists.');
  });

  it('finds the original record by its unchanged term and number if its ID is stale', async () => {
    const updatedCourse = { ...courses.F101, title: 'Updated intro' };
    vi.mocked(update).mockResolvedValue(undefined);

    await updateCourse({ id: 'MissingID', term: 'Fall', number: '101' }, updatedCourse);
    expect(update).toHaveBeenCalledWith(undefined, {
      term: 'Fall',
      number: '101',
      meets: 'MWF 11:00-11:50',
      title: 'Updated intro',
    });
  });

  it('updates the valid record ID even if its stored term and number differ from the edit URL', async () => {
    const storedCourses = {
      ...courses,
      F101: { ...courses.F101, term: 'Winter', number: '102' },
    };
    const updatedCourse = { ...courses.F101, title: 'Corrected course' };
    vi.mocked(get).mockResolvedValue({
      val: () => storedCourses,
    } as Awaited<ReturnType<typeof get>>);
    vi.mocked(update).mockResolvedValue(undefined);

    await updateCourse({ id: 'F101', term: 'Fall', number: '101' }, updatedCourse);

    expect(update).toHaveBeenCalledWith(undefined, {
      term: 'Fall',
      number: '101',
      meets: 'MWF 11:00-11:50',
      title: 'Corrected course',
    });
  });

  it('rejects the update instead of creating a missing original record', async () => {
    await expect(
      updateCourse({ id: 'MissingID', term: 'Spring', number: '101' }, courses.F101),
    ).rejects.toThrow(
      'The course could not be found. Reload the schedule and try again.',
    );
  });

  it('propagates Realtime Database errors', async () => {
    const error = new Error('Database unavailable');
    vi.mocked(update).mockRejectedValue(error);

    await expect(
      updateCourse({ id: 'F101', term: 'Fall', number: '101' }, courses.F101),
    ).rejects.toBe(error);
  });
});
