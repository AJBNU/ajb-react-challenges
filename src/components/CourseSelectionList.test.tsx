import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CourseSelectionList } from './CourseSelectionList';
import type { Course } from '../types/course';

const courses: Course[] = [
  { term: 'Fall', number: '101', meets: 'MWF 9:00-9:50', title: 'First course' },
  { term: 'Fall', number: '102', meets: 'W 9:30-10:00', title: 'Conflicting course' },
];

describe('CourseSelectionList', () => {
  it('disables conflicting courses and makes them selectable again after unselection', () => {
    const onSelectionChange = vi.fn();
    render(
      <CourseSelectionList
        courses={courses}
        allCourses={courses}
        onSelectionChange={onSelectionChange}
      />,
    );

    const firstCourse = screen.getByRole('button', { name: /Fall CS 101/ });
    const conflictingCourse = screen.getByRole('button', { name: /Fall CS 102/ });

    expect(conflictingCourse.hasAttribute('disabled')).toBe(false);
    fireEvent.click(firstCourse);

    expect(firstCourse.getAttribute('aria-pressed')).toBe('true');
    expect(onSelectionChange).toHaveBeenLastCalledWith([courses[0]]);
    expect(conflictingCourse.hasAttribute('disabled')).toBe(true);
    expect(conflictingCourse.classList.contains('bg-red-50')).toBe(true);

    fireEvent.click(firstCourse);

    expect(firstCourse.getAttribute('aria-pressed')).toBe('false');
    expect(conflictingCourse.hasAttribute('disabled')).toBe(false);
    fireEvent.click(conflictingCourse);
    expect(conflictingCourse.getAttribute('aria-pressed')).toBe('true');
  });
});
