import type { AttendanceStudent, CourseAttendance } from '../api/types.ts'

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
