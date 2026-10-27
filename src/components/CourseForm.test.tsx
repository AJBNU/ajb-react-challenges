import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CourseForm } from './CourseForm';
import type { Course } from '../types/course';

const course: Course = {
  term: 'Fall',
  number: '101',
  meets: 'MWF 9:00-9:50',
  title: 'Introduction to Computer Science',
};

describe('CourseForm', () => {
  it('renders blank course fields and returns to the list when canceled', () => {
    const onCancel = vi.fn();
    render(<CourseForm onCancel={onCancel} />);

    expect(
      (screen.getByRole('textbox', { name: 'Course title' }) as HTMLInputElement).value,
    ).toBe('');
    expect(
      (screen.getByRole('textbox', { name: 'Meeting times' }) as HTMLInputElement).value,
    ).toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: /submit/i })).toBeNull();
  });

  it('prevents submission without providing a submit button', () => {
    render(<CourseForm onCancel={vi.fn()} />);
    const form = screen.getByRole('textbox', { name: 'Course title' }).closest('form');

    if (!form) {
      throw new Error('Expected the course fields to be inside a form.');
    }

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
    expect(screen.queryByRole('button', { name: /submit/i })).toBeNull();
  });

  it('prefills fields when editing a course', () => {
    render(<CourseForm course={course} onCancel={vi.fn()} />);

    expect(
      (screen.getByRole('textbox', { name: 'Course title' }) as HTMLInputElement).value,
    ).toBe(course.title);
    expect(
      (screen.getByRole('textbox', { name: 'Meeting times' }) as HTMLInputElement).value,
    ).toBe(course.meets);
  });
});
