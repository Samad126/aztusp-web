import type { AttendanceStudent, CourseAttendance } from '../api/types.ts'
import { toNumber } from './format.ts'

export function findMyRow(attendance: CourseAttendance, studentId: string | undefined): AttendanceStudent | undefined {
  if (!studentId) return undefined
  return attendance.students.find((student) => student.student_id === studentId)
}

export function countMarks(student: AttendanceStudent | undefined) {
  const counts = { present: 0, absent: 0, not_entered: 0 }
  for (const mark of student?.marks ?? []) {
    if (mark.mark) counts[mark.mark] += 1
  }
  return counts
}

/** Classes that have already happened: the sessions the journal has a date for. */
export function countHeld(attendance: CourseAttendance) {
  return attendance.sessions.filter((session) => session.date).length
}

/**
 * Attendance percent if `skipped` more classes are held and the student misses all of them.
 * Scales the portal's own percent by the classes held, so the estimate starts from the figure the page shows.
 * Marks are not used: a student's marks can be missing or not entered while the percent is still shown.
 * Returns null when the percent is missing or no class has been held yet, since there is nothing to scale.
 */
export function estimateRate(attendance: CourseAttendance, student: AttendanceStudent | undefined, skipped: number): number | null {
  const percent = toNumber(student?.percent)
  const held = countHeld(attendance)
  if (percent === null || held <= 0) return null
  return (percent * held) / (held + skipped)
}

/** The lesson count typed into the simulator. Whole numbers from 0 up; anything else counts as 0. */
export function parseLessons(text: string) {
  const value = Math.floor(Number(text))
  return Number.isFinite(value) && value > 0 ? value : 0
}
