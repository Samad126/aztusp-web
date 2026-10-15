import { Chip, Typography } from '@mui/material'
import type { TFunction } from 'i18next'
import type { Column } from '../../components/table/tableRows.ts'
import { absenceLimit, countMarks, type AbsenceStatus } from '../../lib/attendance.ts'
import { toNumber } from '../../lib/format.ts'
import StatusCell from './StatusCell.tsx'
import { absencesOf, mineOf, statusOf, type Row } from './rows.ts'

// Sorting puts the least serious status first.
const STATUS_RANK: Record<AbsenceStatus, number> = { allGood: 0, inLimit: 1, fail: 2 }

/** The columns of the attendance overview, one row per course. Sorting follows the figures shown. */
export function attendanceColumns(t: TFunction, studentId: string | undefined, lessons: number): Column<Row>[] {
  return [
    {
      key: 'course',
      header: t('attendance.course'),
      sortValue: (row) => row.course.name,
      render: (row) => <Typography sx={{ fontWeight: 600 }}>{row.course.name}</Typography>,
    },
    {
      key: 'teacher',
      header: t('attendance.teacher'),
      sortValue: (row) => row.attendance?.info.teacher,
      render: (row) => row.attendance?.info.teacher || '—',
    },
    {
      key: 'hours',
      header: t('attendance.hours'),
      align: 'right',
      sortValue: (row) => toNumber(row.attendance?.info.total_hours),
      render: (row) => row.attendance?.info.total_hours || '—',
    },
    {
      key: 'present',
      header: t('attendance.present'),
      align: 'right',
      sortValue: (row) => (row.attendance ? countMarks(mineOf(row, studentId)).present : null),
      render: (row) => (row.attendance ? countMarks(mineOf(row, studentId)).present : '—'),
    },
    {
      key: 'absent',
      header: t('attendance.absent'),
      align: 'right',
      // Shows the simulated count while lessons are typed in, and sorts by it.
      sortValue: (row) => absencesOf(row, studentId, lessons)?.after ?? null,
      render: (row) => {
        const absences = absencesOf(row, studentId, lessons)
        if (!absences) return '—'
        const label = absences.after === absences.now ? absences.now : `${absences.now} → ${absences.after}`
        return absences.after > 0 ? <Chip size="small" color="error" variant="outlined" label={label} /> : label
      },
    },
    {
      key: 'limit',
      header: t('attendance.maxAbsences'),
      align: 'right',
      sortValue: (row) => absenceLimit(row.attendance?.info.total_hours),
      render: (row) => absenceLimit(row.attendance?.info.total_hours) ?? '—',
    },
    {
      key: 'score',
      header: t('common.score'),
      align: 'right',
      sortValue: (row) => toNumber(mineOf(row, studentId)?.score),
      render: (row) => mineOf(row, studentId)?.score || '—',
    },
    {
      key: 'status',
      header: t('attendance.status'),
      align: 'right',
      sortValue: (row) => {
        const status = statusOf(row, studentId, lessons)
        return status ? STATUS_RANK[status] : null
      },
      render: (row) => <StatusCell row={row} studentId={studentId} lessons={lessons} />,
    },
  ]
}
