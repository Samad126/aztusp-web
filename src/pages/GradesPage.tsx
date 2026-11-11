import { useMemo, useState } from 'react'
import { Stack, TableCell, TableRow } from '@mui/material'
import FinalSimulation from './grades/FinalSimulation.tsx'
import GradeInfoButton from './grades/GradeInfoButton.tsx'
import LetterChip from './grades/LetterChip.tsx'
import DataTable from '../components/table/DataTable.tsx'
import type { Column } from '../components/table/tableRows.ts'
import { Async, EmptyState, PageHeader } from '../components/PageState.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { CourseGrades, GradesPage, ScoresPage, SemesterSummary } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { toNumber } from '../lib/format.ts'
import { courseTotal, letterFor } from '../lib/grades.ts'

const summaryColumns = (t: TFunction): Column<SemesterSummary>[] => [
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

const pointCell = (value: string | null) => (value ? value : '—')

const gradeColumns = (t: TFunction, simulated: Record<string, string>): Column<CourseGrades>[] => {
  const points = (key: keyof Pick<CourseGrades, 'quiz1' | 'midterm' | 'quiz2' | 'individual_work' | 'final'>, header: string): Column<CourseGrades> => ({
    key,
    header,
    align: 'right',
    sortValue: (row) => toNumber(row[key]),
    render: (row) => pointCell(row[key]),
  })
  return [
    { key: 'code', header: t('grades.code'), sortValue: (row) => row.code, noWrap: true },
    { key: 'course', header: t('courses.course'), sortValue: (row) => row.course },
    points('quiz1', t('grades.quiz1')),
    points('midterm', t('grades.midterm')),
    points('quiz2', t('grades.quiz2')),
    points('individual_work', t('grades.individualWork')),
    points('final', t('grades.final')),
    {
      key: 'average',
      header: t('grades.totalPoints'),
      align: 'right',
      sortValue: (row) => courseTotal(row, simulated[row.lec_open_idx])?.total ?? toNumber(row.average),
      render: (row) => {
        // The letter is only shown once there is an exam score, real or simulated; before it the total is partial.
        const result = courseTotal(row, simulated[row.lec_open_idx])
        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
            <strong>{result ? result.total : pointCell(row.average)}</strong>
            {result && <LetterChip letter={letterFor(result.total)} simulated={result.simulated} />}
            <GradeInfoButton />
          </Stack>
        )
      },
    },
  ]
}

export default function GradesPage() {
  const { t } = useTranslation()
  const summaryCols = useMemo(() => summaryColumns(t), [t])
  const [simulated, setSimulated] = useState<Record<string, string>>({})
  const gradeCols = useMemo(() => gradeColumns(t, simulated), [t, simulated])
  const scores = useApi<ScoresPage>(endpoints.scores)
  const grades = useApi<GradesPage>(endpoints.grades)
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

            <Async loading={grades.loading} error={grades.error} onRetry={grades.reload} rows={5}>
              {grades.data && grades.data.courses.length === 0 ? (
                <EmptyState title={t('grades.noResults')}>{t('grades.noResultsHint')}</EmptyState>
              ) : (
                <DataTable
                  title={t('grades.current')}
                  columns={gradeCols}
                  rows={grades.data?.courses ?? []}
                  getRowKey={(row) => row.lec_open_idx}
                  paginate={false}
                  minWidth={760}
                />
              )}
              {grades.data && grades.data.courses.length > 0 && (
                <FinalSimulation
                  courses={grades.data.courses}
                  values={simulated}
                  onChange={(courseId, value) => setSimulated((current) => ({ ...current, [courseId]: value }))}
                />
              )}
            </Async>
          </Stack>
        )}
      </Async>
    </>
  )
}
