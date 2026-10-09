import { Alert, Box, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import { Async } from '../../components/PageState.tsx'
import RecordsTable from '../../components/RecordsTable.tsx'
import { endpoints } from '../../api/endpoints.ts'
import { useApi } from '../../api/useApi.ts'
import type { CourseScores } from '../../api/types.ts'
import { useTranslation } from 'react-i18next'
import { toNumber } from '../../lib/format.ts'

export default function ScoresTab({ courseId }: { courseId: string }) {
  const { t } = useTranslation()
  const scores = useApi<CourseScores>(endpoints.courseScores(courseId))
  const data = scores.data

  return (
    <Async loading={scores.loading} error={scores.error} onRetry={scores.reload} rows={5}>
      {data && (
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
            }}
          >
            <Paper
              elevation={0}
              sx={{ p: 2.5, border: 1, borderColor: 'primary.main', bgcolor: 'action.hover' }}
            >
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {t('scores.total')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {data.total || '—'}
              </Typography>
            </Paper>

            {data.components.map((component) => {
              const score = toNumber(component.score)
              const max = toNumber(component.max)
              const progress = score !== null && max ? Math.min(100, (score / max) * 100) : 0
              return (
                <Paper key={component.name} elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider' }}>
                  <Typography variant="overline" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
                    {component.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {component.score ?? '—'}
                    {component.max && (
                      <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                        {' '}
                        / {component.max}
                      </Typography>
                    )}
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} sx={{ mt: 1.5, height: 6, borderRadius: 3 }} />
                </Paper>
              )
            })}
          </Box>

          {data.table.length > 0 && <RecordsTable title={t('course.scoreTable')} rows={data.table} searchable={false} />}

          {data.notes.map((note, index) => (
            <Alert key={index} severity="info" variant="outlined">
              {note}
            </Alert>
          ))}
        </Stack>
      )}
    </Async>
  )
}
