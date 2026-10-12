export type CourseTerm = 'Fall' | 'Winter' | 'Spring';

interface CourseTermFilterProps {
  terms: readonly CourseTerm[];
  selectedTerm: CourseTerm;
  onSelectTerm: (term: CourseTerm) => void;
}

export const CourseTermFilter = ({
  terms,
  selectedTerm,
  onSelectTerm,
}: CourseTermFilterProps) => {
  return (
    <fieldset className="mb-6">
      <legend className="mb-3 text-lg font-medium text-neutral-900">
        Filter by term
      </legend>
      <div className="flex flex-wrap gap-4">
        {terms.map((term) => (
          <label
            key={term}
            className="flex cursor-pointer items-center gap-2 text-base text-neutral-900"
          >
            <input
              type="radio"
              name="course-term"
              value={term}
              checked={selectedTerm === term}
              onChange={() => onSelectTerm(term)}
            />
            {term}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
