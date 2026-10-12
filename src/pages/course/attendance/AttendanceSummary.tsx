import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { AttendanceStudent, CourseAttendance } from '../../../api/types.ts'
import { countMarks } from '../../../lib/attendance.ts'

/** The student's presence figures for one course, shown above the attendance journal. */
export default function AttendanceSummary({ attendance, student }: { attendance: CourseAttendance; student: AttendanceStudent | undefined }) {
  const { t } = useTranslation()
  const counts = countMarks(student)

  const stats = [
    { label: t('attendance.present'), value: counts.present },
    { label: t('attendance.absent'), value: counts.absent },
    { label: t('attendance.held'), value: attendance.sessions.filter((session) => session.date).length },
  ]

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {stats.map((stat) => (
        <Box key={stat.label} sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {stat.label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {stat.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
