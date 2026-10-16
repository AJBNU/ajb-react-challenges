import { describe, expect, it } from 'vitest';

import { hasTimeConflict } from './courseConflicts.js';
import type { Course } from '../types/course';

const course = (overrides: Partial<Course> = {}): Course => ({
  term: 'Fall',
  number: '101',
  meets: 'MWF 9:00-9:50',
  title: 'Test course',
  ...overrides,
});

describe('hasTimeConflict', () => {
  it('detects overlapping times on a shared day', () => {
    expect(
      hasTimeConflict(course(), course({ number: '102', meets: 'W 9:30-10:00' })),
    ).toBe(true);
  });

  it('does not conflict when courses meet on different days', () => {
    expect(
      hasTimeConflict(course(), course({ number: '102', meets: 'TuTh 9:00-9:50' })),
    ).toBe(false);
  });

  it('does not conflict when one meeting ends as the other begins', () => {
    expect(
      hasTimeConflict(
        course({ meets: 'TuTh 14:00-15:20' }),
        course({ number: '102', meets: 'Th 15:20-16:00' }),
      ),
    ).toBe(false);
  });

  it('does not conflict across terms', () => {
    expect(
      hasTimeConflict(course(), course({ term: 'Spring', number: '102' })),
    ).toBe(false);
  });

  it('does not conflict with a course that has no meeting time', () => {
    expect(hasTimeConflict(course(), course({ meets: '' }))).toBe(false);
  });
});
