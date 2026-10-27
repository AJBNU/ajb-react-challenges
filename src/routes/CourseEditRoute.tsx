import { useNavigate, useParams, useSearch } from '@tanstack/react-router';

import { CourseForm } from '../components/CourseForm';

export const CourseEditRoute = () => {
  const { term, number } = useParams({ from: '/course/$term/$number/edit' });
  const { title, meets } = useSearch({ from: '/course/$term/$number/edit' });
  const navigate = useNavigate();

  return (
    <CourseForm
      course={{ term, number, title, meets }}
      onCancel={() => void navigate({ to: '/index/' })}
    />
  );
};
