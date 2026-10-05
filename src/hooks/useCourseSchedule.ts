import { useEffect, useState } from 'react';

import { fetchCourseSchedule } from '../services/courses';
import type { Course } from '../types/course';

export const useCourseSchedule = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchCourseSchedule();

        if (isMounted) {
          setCourses(fetchedCourses);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Unable to load the course schedule.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return { courses, isLoading, error };
};
