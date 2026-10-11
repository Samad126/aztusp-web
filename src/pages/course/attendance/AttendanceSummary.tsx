import { Box, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import MetricTile from '../../../components/MetricTile.tsx'
import type { AttendanceStudent, CourseAttendance } from '../../../api/types.ts'
import { countMarks } from '../../../lib/attendance.ts'
import { percentTone, toNumber } from '../../../lib/format.ts'

/** The headline figures for the student in one course. The rate comes first, with its bar. */
export default function AttendanceSummary({ attendance, student }: { attendance: CourseAttendance; student: AttendanceStudent | undefined }) {
  const { t } = useTranslation()
  const counts = countMarks(student)
  const percent = toNumber(student?.percent ?? attendance.header.percent)
  const tone = percentTone(percent)

  const stats = [
    { label: t('attendance.rate'), value: student?.percent ?? attendance.header.percent ?? '—' },
    { label: t('common.score'), value: student?.score ?? attendance.header.score ?? '—' },
    { label: t('attendance.present'), value: counts.present },
    { label: t('attendance.absent'), value: counts.absent },
    { label: t('attendance.held'), value: attendance.sessions.filter((session) => session.date).length },
    { label: t('attendance.planned'), value: attendance.sessions.length },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
      }}
    >
      {stats.map((stat, index) => (
        <MetricTile key={stat.label} label={stat.label} value={stat.value} tone={index === 0 ? tone : 'default'}>
          {index === 0 && (
            <LinearProgress
              variant="determinate"
              color={tone === 'default' ? 'primary' : tone}
              value={Math.min(100, percent ?? 0)}
              sx={{ mt: 1, height: 6, borderRadius: 3 }}
            />
          )}
        </MetricTile>
      ))}
    </Box>
  )
}
