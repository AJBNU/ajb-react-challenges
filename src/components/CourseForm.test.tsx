import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('does not provide a submit button for a new course', () => {
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

  it('prefills fields and disables submission when editing without changes', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<CourseForm course={course} onCancel={vi.fn()} onSave={onSave} />);

    expect(
      (screen.getByRole('textbox', { name: 'Course title' }) as HTMLInputElement).value,
    ).toBe(course.title);
    expect(
      (screen.getByRole('textbox', { name: 'Meeting times' }) as HTMLInputElement).value,
    ).toBe(course.meets);
    const submitButton = screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    const form = submitButton.closest('form');

    if (!form) {
      throw new Error('Expected the course fields to be inside a form.');
    }

    fireEvent.submit(form);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('does not save edits with validation errors', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<CourseForm course={course} onCancel={vi.fn()} onSave={onSave} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Course title' }), {
      target: { value: 'A' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('must be at least two characters')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves valid changed course values', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<CourseForm course={course} onCancel={vi.fn()} onSave={onSave} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Course title' }), {
      target: { value: 'Introduction to CS' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        ...course,
        title: 'Introduction to CS',
      });
    });
  });

  it('surfaces save errors without implying the course was saved', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Database unavailable'));
    render(<CourseForm course={course} onCancel={vi.fn()} onSave={onSave} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Course title' }), {
      target: { value: 'Introduction to CS' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Unable to save course: Database unavailable');
  });
});
