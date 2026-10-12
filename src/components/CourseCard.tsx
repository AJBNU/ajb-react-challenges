import type { Course } from '../types/course';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <article className="flex min-h-[230px] flex-col justify-between border border-neutral-300 bg-white p-5 text-black">
      <div>
        <h2 className="mb-5 text-[1.9rem] font-medium leading-tight tracking-[-0.05em] text-neutral-900">
          {course.term} CS {course.number}
        </h2>
        <p className="text-[1.05rem] leading-[1.35] tracking-[-0.02em] text-neutral-800">
          {course.title}
        </p>
      </div>

      <div className="mt-6 border-t border-neutral-300 pt-4 text-[1.05rem] tracking-[-0.02em] text-neutral-900">
        {course.meets}
      </div>
    </article>
  );
};
