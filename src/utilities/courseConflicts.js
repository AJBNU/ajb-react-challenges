const MEETING_PATTERN = /^((?:Tu|Th|Sa|Su|M|W|F)+) (\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/;
const DAY_PATTERN = /Tu|Th|Sa|Su|M|W|F/g;

/**
 * @param {import('../types/course').Course} firstCourse
 * @param {import('../types/course').Course} secondCourse
 */
export const hasTimeConflict = (firstCourse, secondCourse) => {
  if (firstCourse.term !== secondCourse.term) {
    return false;
  }

  const firstMeeting = parseMeeting(firstCourse.meets);
  const secondMeeting = parseMeeting(secondCourse.meets);

  if (firstMeeting === null || secondMeeting === null) {
    return false;
  }

  return (
    shareMeetingDay(firstMeeting.days, secondMeeting.days) &&
    timesOverlap(firstMeeting, secondMeeting)
  );
};

/**
 * @param {string} meeting
 * @returns {{ days: Set<string>, startMinutes: number, endMinutes: number } | null}
 */
const parseMeeting = (meeting) => {
  if (meeting === '') {
    return null;
  }

  const match = MEETING_PATTERN.exec(meeting);
  if (!match) {
    throw new Error(`Invalid course meeting string: ${meeting}`);
  }

  const [, dayString, startTime, endTime] = match;
  const days = dayString.match(DAY_PATTERN) ?? [];

  if (days.join('') !== dayString || new Set(days).size !== days.length) {
    throw new Error(`Invalid course meeting days: ${dayString}`);
  }

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  if (startMinutes >= endMinutes) {
    throw new Error(`Course meeting must end after it starts: ${meeting}`);
  }

  return { days: new Set(days), startMinutes, endMinutes };
};

/**
 * @param {string} time
 */
const parseTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);

  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid course meeting time: ${time}`);
  }

  return hours * 60 + minutes;
};

/**
 * @param {Set<string>} firstDays
 * @param {Set<string>} secondDays
 */
const shareMeetingDay = (firstDays, secondDays) =>
  [...firstDays].some((day) => secondDays.has(day));

/**
 * @param {{ startMinutes: number, endMinutes: number }} firstMeeting
 * @param {{ startMinutes: number, endMinutes: number }} secondMeeting
 */
const timesOverlap = (firstMeeting, secondMeeting) =>
  firstMeeting.startMinutes < secondMeeting.endMinutes &&
  secondMeeting.startMinutes < firstMeeting.endMinutes;
