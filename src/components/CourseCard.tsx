import { Link } from '@tanstack/react-router';

import type { Course } from '../types/course';

interface CourseCardProps {
  course: Course;
  isSelected?: boolean;
  isSelectable?: boolean;
  onToggle?: () => void;
}

export const CourseCard = ({
  course,
  isSelected = false,
  isSelectable = true,
  onToggle,
}: CourseCardProps) => {
  return (
    <article
      className={[
        'flex min-h-[230px] w-full flex-col border transition-colors duration-200',
        isSelected
          ? 'border-emerald-600 bg-emerald-50 shadow-sm'
          : isSelectable
            ? 'border-neutral-300 bg-white'
            : 'border-red-200 bg-red-50',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isSelected}
        disabled={!isSelectable}
        className={[
          'flex flex-1 flex-col justify-between p-5 text-left',
          isSelected
            ? 'cursor-pointer bg-emerald-50'
            : isSelectable
              ? 'cursor-pointer bg-white hover:bg-neutral-50'
              : 'cursor-not-allowed bg-red-50',
        ].join(' ')}
      >
        <div>
          <h2 className="mb-5 flex items-center justify-between gap-3 text-[1.9rem] font-medium leading-tight tracking-[-0.05em] text-neutral-900">
            <span>
              {course.term} CS {course.number}
            </span>
            {isSelected ? (
              <span className="shrink-0 text-base text-emerald-700" aria-hidden="true">
                ✓
              </span>
            ) : !isSelectable ? (
              <span className="shrink-0 text-base text-red-500" aria-hidden="true">
                ×
              </span>
            ) : null}
          </h2>
          {!isSelectable ? (
            <span className="sr-only">Unavailable due to a schedule conflict.</span>
          ) : null}
          <p className="text-[1.05rem] leading-[1.35] tracking-[-0.02em] text-neutral-800">
            {course.title}
          </p>
        </div>

        <span className="mt-6 border-t border-neutral-300 pt-4 text-[1.05rem] tracking-[-0.02em] text-neutral-900">
          {course.meets}
        </span>
      </button>
      <Link
        to="/course/$term/$number/edit/"
        params={{ term: course.term, number: course.number }}
        search={{
          id: course.id ?? `${course.term.charAt(0)}${course.number}`,
          title: course.title,
          meets: course.meets,
        }}
        className="border-t border-neutral-300 px-5 py-3 text-sm font-medium text-blue-800 underline hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-800"
      >
        Edit {course.term} CS {course.number}
      </Link>
    </article>
  );
};
