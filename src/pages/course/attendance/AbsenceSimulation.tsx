import { useState } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AbsenceInput from '../../../components/AbsenceInput.tsx'
import MetricTile from '../../../components/MetricTile.tsx'
import type { AttendanceStudent, CourseAttendance } from '../../../api/types.ts'
import { countHeld, countMarks, estimateRate, parseLessons } from '../../../lib/attendance.ts'
import { formatPercent, percentTone, toNumber } from '../../../lib/format.ts'

/** Estimates the student's rate and counts if they miss the lessons typed in. Nothing is saved or sent. */
export default function AbsenceSimulation({ attendance, student }: { attendance: CourseAttendance; student: AttendanceStudent }) {
  const { t, i18n } = useTranslation()
  const [absence, setAbsence] = useState('')
  const lessons = parseLessons(absence)
  const counts = countMarks(student)
  const held = countHeld(attendance)
  const remaining = Math.max(0, attendance.sessions.length - held)
  const before = toNumber(student.percent)
  const after = estimateRate(attendance, student, lessons)

  const stats = [
    {
      label: t('absence.column'),
      value: `${before === null ? '—' : formatPercent(before, i18n.language)} → ${after === null ? '—' : formatPercent(after, i18n.language)}`,
      tone: percentTone(after),
    },
    { label: t('attendance.absent'), value: `${counts.absent} → ${counts.absent + lessons}`, tone: 'default' as const },
    { label: t('attendance.held'), value: `${held} → ${held + lessons}`, tone: 'default' as const },
  ]

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {t('absence.title')}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {t('absence.description')}
      </Typography>
      <Box sx={{ display: 'grid', gap: 2, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' } }}>
        <AbsenceInput value={absence} onChange={setAbsence} helperText={t('absence.remaining', { remaining })} />
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))' }}>
          {stats.map((stat) => (
            <MetricTile key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
          ))}
        </Box>
      </Box>
    </Paper>
  )
}
