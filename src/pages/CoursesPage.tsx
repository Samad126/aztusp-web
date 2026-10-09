import { useNavigate } from 'react-router-dom'
import { Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import { alpha } from '@mui/material/styles'
import { Async, EmptyState, PageHeader } from '../components/PageState.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import { useTranslation } from 'react-i18next'
import type { Course } from '../api/types.ts'

export default function CoursesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const courses = useApi<Course[]>(endpoints.courses)

  return (
    <>
      <PageHeader title={t('courses.title')} description={t('courses.description')} />
      <Async loading={courses.loading} error={courses.error} onRetry={courses.reload} rows={4}>
        {courses.data?.length === 0 ? (
          <EmptyState title={t('courses.empty')}>{t('courses.emptyHint')}</EmptyState>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            }}
          >
            {courses.data?.map((course) => (
              <Card key={course.lec_open_idx} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <CardActionArea
                  onClick={() => navigate(`/courses/${encodeURIComponent(course.lec_open_idx)}`)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: 2,
                          color: 'primary.main',
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                        }}
                      >
                        <MenuBookOutlinedIcon />
                      </Box>
                      {course.sem_code && <Chip size="small" variant="outlined" label={course.sem_code} />}
                    </Box>
                    <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>{course.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {t('courses.open')}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Async>
    </>
  )
}
