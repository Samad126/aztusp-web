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
 * Most absences (qayıb) a student may have in a course: 25% of its total class hours, where one absence counts as
 * two academic hours, rounded down. One more absence is past the limit and leaves the student in debt for the course
 * or barred from its exam. Null when the course has no total hours.
 */
export function absenceLimit(totalHours: string | undefined): number | null {
  const hours = toNumber(totalHours)
  return hours === null ? null : Math.floor((hours * 0.25) / 2)
}

/**
 * Where a student stands against the absence limit: below it (All good), exactly at it so the maximum is reached
 * (In limit), or past it (Fail).
 */
export type AbsenceStatus = 'allGood' | 'inLimit' | 'fail'

export function absenceStatus(absences: number, limit: number): AbsenceStatus {
  if (absences > limit) return 'fail'
  return absences === limit ? 'inLimit' : 'allGood'
}

/** The lesson count typed into the simulator. Whole numbers from 0 up; anything else counts as 0. */
export function parseLessons(text: string) {
  const value = Math.floor(Number(text))
  return Number.isFinite(value) && value > 0 ? value : 0
}
