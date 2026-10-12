import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { AttendanceStudent, CourseAttendance } from '../../../api/types.ts'
import { absenceLimit, absenceStatus, countHeld, countMarks } from '../../../lib/attendance.ts'
import type { Tone } from '../../../lib/format.ts'
import AbsenceStatusChip from '../../attendance/AbsenceStatusChip.tsx'
import StatusInfoButton from '../../attendance/StatusInfoButton.tsx'

/**
 * The student's figures for one course, shown above the attendance journal. The absences and the status count the
 * typed lessons as missed, the same way the overview does. Absences turn red past the limit.
 */
export default function AttendanceSummary({
  attendance,
  student,
  lessons,
}: {
  attendance: CourseAttendance
  student: AttendanceStudent | undefined
  lessons: number
}) {
  const { t } = useTranslation()
  const counts = countMarks(student)
  const limit = absenceLimit(attendance.info.total_hours)
  const absentAfter = counts.absent + lessons
  const overLimit = limit !== null && absentAfter > limit
  const status = limit === null ? null : absenceStatus(absentAfter, limit)

  const stats: { label: string; value: ReactNode; tone?: Tone }[] = [
    { label: t('attendance.present'), value: counts.present },
    {
      label: t('attendance.absent'),
      value: lessons > 0 ? `${counts.absent} → ${absentAfter}` : counts.absent,
      tone: overLimit ? 'error' : 'default',
    },
    { label: t('attendance.held'), value: countHeld(attendance) },
    { label: t('attendance.limit'), value: limit ?? '—' },
    {
      label: t('attendance.status'),
      value: status ? (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <AbsenceStatusChip status={status} />
          <StatusInfoButton />
        </Stack>
      ) : (
        '—'
      ),
    },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(5, minmax(0, 1fr))' },
      }}
    >
      {stats.map((stat) => {
        const tone = stat.tone ?? 'default'
        return (
          <Box key={stat.label} sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {stat.label}
            </Typography>
            <Typography component="div" variant="h6" sx={{ fontWeight: 700, color: tone === 'default' ? 'text.primary' : `${tone}.main` }}>
              {stat.value}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
