import { Stack, Typography } from '@mui/material'
import { Async, EmptyState, PageHeader } from '../components/PageState.tsx'
import RecordsTable from '../components/RecordsTable.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import { useTranslation } from 'react-i18next'
import type { SchedulePage as ScheduleData } from '../api/types.ts'

export default function SchedulePage() {
  const { t } = useTranslation()
  const schedule = useApi<ScheduleData>(endpoints.schedule)
  const semesters = schedule.data?.sections.semesters ?? []

  return (
    <>
      <PageHeader title={t('schedule.title')} description={t('schedule.description')} />
      <Async loading={schedule.loading} error={schedule.error} onRetry={schedule.reload} rows={6}>
        {semesters.length === 0 ? (
          <EmptyState title={t('schedule.empty')}>{t('schedule.emptyHint')}</EmptyState>
        ) : (
          <Stack spacing={3}>
            {semesters.map((semester, index) =>
              semester.rows.length === 0 ? (
                <EmptyState key={index} title={semester.title ?? 'Timetable'}>
                  {t('schedule.noLessons')}
                </EmptyState>
              ) : (
                <RecordsTable
                  key={index}
                  title={semester.title ?? t('schedule.semester', { n: index + 1 })}
                  rows={semester.rows}
                  searchable={false}
                  minWidth={900}
                />
              ),
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('schedule.footnote')}
            </Typography>
          </Stack>
        )}
      </Async>
    </>
  )
}
