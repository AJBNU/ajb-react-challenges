import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CoursePlanDialog } from './CoursePlanDialog';
import type { Course } from '../types/course';

const courses: Course[] = [
  { term: 'Fall', number: '101', meets: 'MWF 9:00-9:50', title: 'First course' },
];

describe('CoursePlanDialog', () => {
  it('shows guidance when no courses are selected', () => {
    render(<CoursePlanDialog courses={[]} onClose={vi.fn()} />);

    expect(screen.getByText('No courses selected yet.')).toBeTruthy();
    expect(screen.getByText(/select courses by clicking their cards/i)).toBeTruthy();
  });

  it('lists course numbers, titles, and meeting times', () => {
    render(<CoursePlanDialog courses={courses} onClose={vi.fn()} />);

    expect(screen.getByText('Fall CS 101: First course')).toBeTruthy();
    expect(screen.getByText('MWF 9:00-9:50')).toBeTruthy();
  });

  it('closes from the close button or backdrop, but not from inside the dialog', () => {
    const onClose = vi.fn();
    render(<CoursePlanDialog courses={courses} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement;

    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
