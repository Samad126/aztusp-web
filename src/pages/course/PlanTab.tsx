import { Paper, Stack, Typography } from '@mui/material'
import KeyValueGrid from '../../components/KeyValueGrid.tsx'
import { Async, EmptyState } from '../../components/PageState.tsx'
import RecordsTable from '../../components/RecordsTable.tsx'
import { endpoints } from '../../api/endpoints.ts'
import { useApi } from '../../api/useApi.ts'
import type { LecturePlan } from '../../api/types.ts'
import { fieldLabel } from '../../i18n/index.ts'
import { useTranslation } from 'react-i18next'

export default function PlanTab({ courseId }: { courseId: string }) {
  const { t } = useTranslation()
  const plan = useApi<LecturePlan>(endpoints.coursePlan(courseId))
  const info = Object.entries(plan.data?.info ?? {}).map(([key, value]) => ({ label: fieldLabel(key), value }))
  const blocks = plan.data?.blocks ?? []

  return (
    <Async loading={plan.loading} error={plan.error} onRetry={plan.reload} rows={6}>
      <Stack spacing={3}>
        {info.length > 0 && <KeyValueGrid title={plan.data?.semester ?? t('course.info')} items={info} />}
        {blocks.length === 0 && info.length === 0 && <EmptyState title={t('course.noPlan')} />}
        {blocks.map((block, index) =>
          block.rows ? (
            <RecordsTable key={index} title={block.title} rows={block.rows} />
          ) : (
            <Paper key={index} elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {block.title}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>{block.text || '—'}</Typography>
            </Paper>
          ),
        )}
      </Stack>
    </Async>
  )
}
