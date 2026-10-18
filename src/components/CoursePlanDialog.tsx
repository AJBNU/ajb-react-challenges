import type { Course } from '../types/course';

interface CoursePlanDialogProps {
  courses: Course[];
  onClose: () => void;
}

export const CoursePlanDialog = ({ courses, onClose }: CoursePlanDialogProps) => {
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-plan-title"
        className="w-full max-w-lg bg-white p-6 text-neutral-900 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="course-plan-title" className="mb-4 text-2xl font-medium">
          Course plan
        </h2>
        {courses.length === 0 ? (
          <div className="mb-6 space-y-2">
            <p>No courses selected yet.</p>
            <p>Select courses by clicking their cards. Courses with schedule conflicts cannot be selected.</p>
          </div>
        ) : (
          <ul className="mb-6 space-y-4">
            {courses.map((course) => (
              <li key={`${course.term}-${course.number}`} className="border-b border-neutral-200 pb-3">
                <p className="font-medium">
                  {course.term} CS {course.number}: {course.title}
                </p>
                <p className="mt-1 text-neutral-700">{course.meets}</p>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onClose}
          className="border border-neutral-400 px-4 py-2 hover:bg-neutral-100"
        >
          Close
        </button>
      </section>
    </div>
  );
};
