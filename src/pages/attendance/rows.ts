import type { AttendanceStudent, Course, CourseAttendance } from '../../api/types.ts'
import { absenceLimit, absenceStatus, countHeld, countMarks, findMyRow, type AbsenceStatus } from '../../lib/attendance.ts'

/** One course on the attendance page: its attendance once it has loaded, or the reason it could not load. */
export interface Row {
  course: Course
  state: 'loading' | 'error' | 'ready'
  error?: string
  attendance?: CourseAttendance
}

/** The student's own row in a course's journal. */
export function mineOf(row: Row, studentId: string | undefined): AttendanceStudent | undefined {
  return row.attendance ? findMyRow(row.attendance, studentId) : undefined
}

/**
 * The student's absences now, and after the typed lessons are missed. Only lessons still to come can be missed,
 * so the simulated count stops at the number left in the course. Null while the course has not loaded.
 */
export function absencesOf(row: Row, studentId: string | undefined, lessons: number): { now: number; after: number } | null {
  if (!row.attendance) return null
  const now = countMarks(mineOf(row, studentId)).absent
  const remaining = Math.max(0, row.attendance.sessions.length - countHeld(row.attendance))
  return { now, after: now + Math.min(lessons, remaining) }
}

/**
 * The student's standing against the absence limit, with the typed lessons still to come counted as missed.
 * Null when the course has no total hours or the student has no row in its journal.
 */
export function statusOf(row: Row, studentId: string | undefined, lessons: number): AbsenceStatus | null {
  const limit = absenceLimit(row.attendance?.info.total_hours)
  const absences = absencesOf(row, studentId, lessons)
  if (!mineOf(row, studentId) || limit === null || !absences) return null
  return absenceStatus(absences.after, limit)
}
