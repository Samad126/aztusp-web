import { Chip, Typography } from '@mui/material'
import type { TFunction } from 'i18next'
import type { Column } from '../../components/table/tableRows.ts'
import { countMarks } from '../../lib/attendance.ts'
import { toNumber } from '../../lib/format.ts'
import RateCell from './RateCell.tsx'
import { estimateOf, mineOf, type Row } from './rows.ts'

/** The columns of the attendance overview, one row per course. Sorting follows the figures shown, including the estimate. */
export function attendanceColumns(t: TFunction, studentId: string | undefined, lessons: number): Column<Row>[] {
  return [
    {
      key: 'course',
      header: t('attendance.course'),
      sortValue: (row) => row.course.name,
      render: (row) => <Typography sx={{ fontWeight: 600, minWidth: 200 }}>{row.course.name}</Typography>,
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
      sortValue: (row) => (row.attendance ? countMarks(mineOf(row, studentId)).absent : null),
      render: (row) => {
        if (!row.attendance) return '—'
        const absent = countMarks(mineOf(row, studentId)).absent
        return absent > 0 ? <Chip size="small" color="error" variant="outlined" label={absent} /> : absent
      },
    },
    {
      key: 'score',
      header: t('common.score'),
      align: 'right',
      sortValue: (row) => toNumber(mineOf(row, studentId)?.score),
      render: (row) => mineOf(row, studentId)?.score || '—',
    },
    {
      key: 'rate',
      header: t('attendance.rate'),
      align: 'right',
      // Sorts by the figure shown: the estimate while absences are simulated, otherwise the portal's rate.
      sortValue: (row) => (lessons > 0 ? estimateOf(row, studentId, lessons) : null) ?? toNumber(mineOf(row, studentId)?.percent),
      render: (row) => <RateCell row={row} studentId={studentId} lessons={lessons} />,
    },
  ]
}
