import { useNavigate } from '@tanstack/react-router';

import { CourseForm } from '../components/CourseForm';

export const CourseFormRoute = () => {
  const navigate = useNavigate();

  return <CourseForm onCancel={() => void navigate({ to: '/index/' })} />;
};
