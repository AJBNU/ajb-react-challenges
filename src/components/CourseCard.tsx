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
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      disabled={!isSelectable}
      className={[
        'flex min-h-[230px] w-full flex-col justify-between border p-5 text-left transition-colors duration-200',
        isSelected
          ? 'cursor-pointer border-emerald-600 bg-emerald-50 shadow-sm'
          : isSelectable
            ? 'cursor-pointer border-neutral-300 bg-white hover:border-neutral-400'
            : 'cursor-not-allowed border-red-200 bg-red-50',
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

      <div className="mt-6 border-t border-neutral-300 pt-4 text-[1.05rem] tracking-[-0.02em] text-neutral-900">
        {course.meets}
      </div>
    </button>
  );
};
