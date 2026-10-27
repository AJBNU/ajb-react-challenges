import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';

import App from './App';
import { CourseFormRoute } from './routes/CourseFormRoute';
import { CourseEditRoute } from './routes/CourseEditRoute';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const redirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/index/' });
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/index',
  component: App,
});

const courseFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/new',
  component: CourseFormRoute,
});

const courseEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/course/$term/$number/edit',
  validateSearch: (search: Record<string, unknown>) => ({
    title: typeof search.title === 'string' ? search.title : '',
    meets: typeof search.meets === 'string' ? search.meets : '',
  }),
  component: CourseEditRoute,
});

export const routeTree = rootRoute.addChildren([
  redirectRoute,
  indexRoute,
  courseFormRoute,
  courseEditRoute,
]);

export const router = createRouter({ routeTree, trailingSlash: 'always' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
