import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import { routeTree } from '../router';

vi.mock('../App', () => ({
  default: () => <main>Main course list</main>,
}));

describe('course form route', () => {
  it('renders blank fields and cancels to the course list', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/course/new/'],
    });
    const router = createRouter({ routeTree, history, trailingSlash: 'always' });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Add course' })).toBeTruthy();
    expect((screen.getByRole('textbox', { name: 'Course title' }) as HTMLInputElement).value).toBe(
      '',
    );
    expect(
      (screen.getByRole('textbox', { name: 'Meeting times' }) as HTMLInputElement).value,
    ).toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Main course list')).toBeTruthy();
    await waitFor(() => expect(history.location.pathname).toBe('/index/'));
  });

  it('prefills the edit form from the selected course', async () => {
    const history = createMemoryHistory({
      initialEntries: [
        '/course/Fall/101/edit/?title=Introduction%20to%20CS&meets=MWF%209%3A00-9%3A50',
      ],
    });
    const router = createRouter({ routeTree, history, trailingSlash: 'always' });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Edit Fall CS 101' })).toBeTruthy();
    expect((screen.getByRole('textbox', { name: 'Course title' }) as HTMLInputElement).value).toBe(
      'Introduction to CS',
    );
    expect(
      (screen.getByRole('textbox', { name: 'Meeting times' }) as HTMLInputElement).value,
    ).toBe('MWF 9:00-9:50');
  });
});
