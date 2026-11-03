import { useNavigate, useParams, useSearch } from '@tanstack/react-router';

import { CourseForm } from '../components/CourseForm';
import { updateCourse } from '../services/courses';

export const CourseEditRoute = () => {
  const { term, number } = useParams({ from: '/course/$term/$number/edit' });
  const { id, title, meets } = useSearch({ from: '/course/$term/$number/edit' });
  const navigate = useNavigate();

  return (
    <CourseForm
      course={{ term, number, title, meets }}
      onCancel={() => void navigate({ to: '/index/' })}
      onSave={async (updatedCourse) => {
        await updateCourse({ id, term, number }, updatedCourse);
        await navigate({ to: '/index/' });
      }}
    />
  );
};
