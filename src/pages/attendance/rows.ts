import type { AttendanceStudent, Course, CourseAttendance } from '../../api/types.ts'
import { estimateRate, findMyRow } from '../../lib/attendance.ts'

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

/** The rate if the typed lessons are missed, or null while there is nothing to estimate from. */
export function estimateOf(row: Row, studentId: string | undefined, lessons: number): number | null {
  return row.attendance ? estimateRate(row.attendance, mineOf(row, studentId), lessons) : null
}
