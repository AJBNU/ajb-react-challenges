import type { FormEvent } from 'react';

import type { Course } from '../types/course';

interface CourseFormProps {
  course?: Course;
  onCancel: () => void;
}

export const CourseForm = ({ course, onCancel }: CourseFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <section className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-medium">
          {course ? `Edit ${course.term} CS ${course.number}` : 'Add course'}
        </h1>
        <p className="mb-6 text-neutral-700">
          {course
            ? 'Update the course title and meeting times.'
            : 'Enter the course title and meeting times.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="course-title" className="mb-2 block font-medium">
              Course title
            </label>
            <input
              id="course-title"
              name="title"
              type="text"
              defaultValue={course?.title ?? ''}
              className="w-full border border-neutral-400 px-3 py-2 text-base"
            />
          </div>
          <div>
            <label htmlFor="course-meets" className="mb-2 block font-medium">
              Meeting times
            </label>
            <input
              id="course-meets"
              name="meets"
              type="text"
              defaultValue={course?.meets ?? ''}
              className="w-full border border-neutral-400 px-3 py-2 text-base"
            />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="border border-neutral-400 bg-white px-4 py-2 text-base text-neutral-900 hover:bg-neutral-100"
          >
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
};
