import { useMemo } from 'react'
import { Chip, Stack, TableCell, TableRow, Typography } from '@mui/material'
import DataTable, { type Column } from '../components/DataTable.tsx'
import { Async, EmptyState, PageHeader } from '../components/PageState.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { CourseResult, ScoresPage, SemesterSummary } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { gradeTone, toNumber } from '../lib/format.ts'

type T = TFunction

const summaryColumns = (t: T): Column<SemesterSummary>[] => [
  { key: 'semester', header: t('grades.semester'), sortValue: (row) => row.semester, noWrap: true },
  { key: 'total_courses', header: t('grades.courses'), align: 'right', sortValue: (row) => toNumber(row.total_courses) },
  { key: 'attended_courses', header: t('grades.attended'), align: 'right', sortValue: (row) => toNumber(row.attended_courses) },
  { key: 'total_credits', header: t('common.credits'), align: 'right', sortValue: (row) => toNumber(row.total_credits) },
  { key: 'earned_credits', header: t('grades.earned'), align: 'right', sortValue: (row) => toNumber(row.earned_credits) },
  {
    key: 'final_average',
    header: t('grades.average'),
    align: 'right',
    sortValue: (row) => toNumber(row.final_average),
    render: (row) => <strong>{row.final_average || '—'}</strong>,
  },
]

const resultColumns = (t: T): Column<CourseResult>[] => [
  { key: 'course', header: t('courses.course'), sortValue: (row) => row.course, render: (row) => <strong>{row.course}</strong> },
  {
    key: 'course_type',
    header: t('grades.type'),
    sortValue: (row) => row.course_type,
    render: (row) => (row.course_type ? <Chip size="small" variant="outlined" label={row.course_type} /> : '—'),
  },
  { key: 'credits', header: t('common.credits'), align: 'right', sortValue: (row) => toNumber(row.credits) },
  {
    key: 'final_score',
    header: t('grades.finalScore'),
    align: 'right',
    sortValue: (row) => toNumber(row.final_score),
    render: (row) => row.final_score || '—',
  },
  {
    key: 'grade',
    header: t('grades.grade'),
    align: 'center',
    sortValue: (row) => row.grade,
    render: (row) =>
      row.grade ? <Chip size="small" color={gradeTone(row.grade)} label={row.grade} sx={{ minWidth: 40, fontWeight: 700 }} /> : '—',
  },
  {
    key: 'retake',
    header: t('grades.retake'),
    align: 'center',
    sortValue: (row) => row.retake,
    render: (row) =>
      row.retake.toUpperCase() === 'Y' ? <Chip size="small" color="warning" label={t('grades.retake')} /> : <Typography variant="body2" sx={{ color: 'text.secondary' }}>—</Typography>,
  },
]

export default function GradesPage() {
  const { t } = useTranslation()
  const summaryCols = useMemo(() => summaryColumns(t), [t])
  const resultCols = useMemo(() => resultColumns(t), [t])
  const scores = useApi<ScoresPage>(endpoints.scores)
  const data = scores.data
  const total = data?.totals.semesters

  return (
    <>
      <PageHeader title={t('grades.title')} description={t('grades.description')} />
      <Async loading={scores.loading} error={scores.error} onRetry={scores.reload} rows={6}>
        {data && (
          <Stack spacing={3}>
            <DataTable
              title={t('grades.summary')}
              columns={summaryCols}
              rows={data.tables.semesters}
              getRowKey={(row, index) => `${row.semester}-${index}`}
              paginate={false}
              minWidth={620}
              emptyMessage={t('grades.noSemesters')}
              footer={
                total && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t('common.total')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{total.total_courses}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{total.attended_courses}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{total.total_credits}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{total.earned_credits}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{total.final_average}</TableCell>
                  </TableRow>
                )
              }
            />

            {data.sections.semester_courses.length === 0 && (
              <EmptyState title={t('grades.noResults')}>{t('grades.noResultsHint')}</EmptyState>
            )}

            {data.sections.semester_courses.map((semester, index) => (
              <DataTable
                key={index}
                title={semester.title ?? t('schedule.semester', { n: index + 1 })}
                subtitle={semester.rows.length === 1 ? t('grades.courseCountOne') : t('grades.courseCount', { n: semester.rows.length })}
                columns={resultCols}
                rows={semester.rows}
                getRowKey={(row, rowIndex) => `${row.course}-${rowIndex}`}
                searchable={semester.rows.length > 8}
                searchPlaceholder={t('grades.searchCourses')}
                minWidth={680}
              />
            ))}
          </Stack>
        )}
      </Async>
    </>
  )
}
