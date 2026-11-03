import { useState, type ChangeEvent, type FormEvent } from 'react';

import { COURSE_TERMS, validateCourse, type Course, type CourseFieldErrors } from '../types/course';

interface CourseFormProps {
  course?: Course;
  onCancel: () => void;
  onSave?: (course: Course) => Promise<void>;
}

const emptyCourse = {
  title: '',
  term: '',
  number: '',
  meets: '',
};

export const CourseForm = ({ course, onCancel, onSave }: CourseFormProps) => {
  const [formValues, setFormValues] = useState<Course>(course ?? emptyCourse);
  const [formErrors, setFormErrors] = useState<CourseFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    course !== undefined &&
    (formValues.term !== course.term ||
      formValues.number !== course.number ||
      formValues.meets !== course.meets ||
      formValues.title !== course.title);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const nextValues = { ...formValues, [name]: value };
    setFormValues(nextValues);
    setSubmitError(null);

    const nextErrors = validateCourse(nextValues);
    setFormErrors((previousErrors) => {
      const updatedErrors = { ...previousErrors };
      const key = name as keyof CourseFieldErrors;

      if (nextErrors[key]) {
        updatedErrors[key] = nextErrors[key];
      } else {
        delete updatedErrors[key];
      }

      return updatedErrors;
    });
  };

  const handleBlur = () => {
    setFormErrors(validateCourse(formValues));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCourse(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !hasChanges || !course || !onSave) {
      return;
    }

    setSubmitError(null);
    setIsSaving(true);

    try {
      await onSave({
        term: formValues.term.trim(),
        number: formValues.number.trim(),
        meets: formValues.meets.trim(),
        title: formValues.title.trim(),
      });
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error ? caughtError.message : 'Unable to save course changes.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-6 text-black">
      <section className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-medium">
          {course ? `Edit ${course.term} CS ${course.number}` : 'Add course'}
        </h1>
        <p className="mb-6 text-neutral-700">
          {course
            ? 'Update the course information.'
            : 'Enter the course details.'}
        </p>
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          <div>
            <label htmlFor="course-term" className="mb-2 block font-medium">
              Course term
            </label>
            <select
              id="course-term"
              name="term"
              value={formValues.term}
              onChange={updateField}
              onBlur={handleBlur}
              aria-invalid={Boolean(formErrors.term)}
              className="w-full border border-neutral-400 bg-white px-3 py-2 text-base"
            >
              <option value="">Select a term</option>
              {COURSE_TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
            {formErrors.term ? <p className="mt-1 text-sm text-red-600">{formErrors.term}</p> : null}
          </div>

          <div>
            <label htmlFor="course-number" className="mb-2 block font-medium">
              Course number
            </label>
            <input
              id="course-number"
              name="number"
              type="text"
              value={formValues.number}
              onChange={updateField}
              onBlur={handleBlur}
              aria-invalid={Boolean(formErrors.number)}
              className="w-full border border-neutral-400 px-3 py-2 text-base"
              placeholder="101 or 213-2"
            />
            {formErrors.number ? <p className="mt-1 text-sm text-red-600">{formErrors.number}</p> : null}
          </div>

          <div>
            <label htmlFor="course-title" className="mb-2 block font-medium">
              Course title
            </label>
            <input
              id="course-title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={updateField}
              onBlur={handleBlur}
              aria-invalid={Boolean(formErrors.title)}
              className="w-full border border-neutral-400 px-3 py-2 text-base"
            />
            {formErrors.title ? <p className="mt-1 text-sm text-red-600">{formErrors.title}</p> : null}
          </div>

          <div>
            <label htmlFor="course-meets" className="mb-2 block font-medium">
              Meeting times
            </label>
            <input
              id="course-meets"
              name="meets"
              type="text"
              value={formValues.meets}
              onChange={updateField}
              onBlur={handleBlur}
              aria-invalid={Boolean(formErrors.meets)}
              className="w-full border border-neutral-400 px-3 py-2 text-base"
              placeholder="MWF 9:00-9:50"
            />
            {formErrors.meets ? <p className="mt-1 text-sm text-red-600">{formErrors.meets}</p> : null}
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="border border-neutral-400 bg-white px-4 py-2 text-base text-neutral-900 hover:bg-neutral-100"
          >
            Cancel
          </button>
          {course ? (
            <button
              type="submit"
              disabled={!hasChanges || isSaving}
              className="ml-3 border border-blue-800 bg-blue-800 px-4 py-2 text-base text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Submit'}
            </button>
          ) : null}
          {submitError ? (
            <p className="mt-3 text-sm text-red-600" role="alert">
              Unable to save course: {submitError}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
};
