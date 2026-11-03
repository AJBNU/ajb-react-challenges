import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { CourseSelectionList } from './CourseSelectionList';
import type { Course } from '../types/course';

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
    to,
    params,
    search,
  }: {
    children: ReactNode;
    className?: string;
    to: string;
    params: { term: string; number: string };
    search: { id: string; title: string; meets: string };
  }) => (
    <a
      className={className}
      href={`${to.replace('$term', params.term).replace('$number', params.number)}?id=${encodeURIComponent(search.id)}&title=${encodeURIComponent(search.title)}&meets=${encodeURIComponent(search.meets)}`}
    >
      {children}
    </a>
  ),
}));

const courses: Course[] = [
  { id: 'F101', term: 'Fall', number: '101', meets: 'MWF 9:00-9:50', title: 'First course' },
  { id: 'F102', term: 'Fall', number: '102', meets: 'W 9:30-10:00', title: 'Conflicting course' },
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

    expect(screen.getByRole('link', { name: 'Edit Fall CS 101' }).getAttribute('href')).toBe(
      '/course/Fall/101/edit/?id=F101&title=First%20course&meets=MWF%209%3A00-9%3A50',
    );
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
