import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom'
import { Box, Button, Chip, Tab, Tabs, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { Course } from '../api/types.ts'
import type { MessageKey } from '../i18n/messages.ts'
import { useTranslation } from 'react-i18next'
import PlanTab from './course/PlanTab.tsx'
import ItemsTab from './course/ItemsTab.tsx'
import ScoresTab from './course/ScoresTab.tsx'
import AttendanceTab from './course/AttendanceTab.tsx'

const tabs = ['plan', 'notices', 'board', 'materials', 'tasks', 'scores', 'attendance'] as const

type TabValue = (typeof tabs)[number]

export default function CourseDetailPage() {
  const { courseId = '' } = useParams()
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const courses = useApi<Course[]>(endpoints.courses)
  const course = courses.data?.find((item) => item.lec_open_idx === courseId)

  const requested = params.get('tab')
  const active: TabValue = tabs.find((tab) => tab === requested) ?? 'plan'

  return (
    <>
      <Button component={RouterLink} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 1, ml: -1 }}>
        {t('courses.all')}
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {course?.name ?? t('courses.course')}
        </Typography>
        {course?.sem_code && <Chip size="small" variant="outlined" label={course.sem_code} />}
      </Box>

      <Tabs
        value={active}
        onChange={(_, value: TabValue) => setParams(value === 'plan' ? {} : { tab: value }, { replace: true })}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        {tabs.map((tab) => (
          <Tab key={tab} value={tab} label={t(`course.tab.${tab}` as MessageKey)} sx={{ textTransform: 'none', fontWeight: 500 }} />
        ))}
      </Tabs>

      {active === 'plan' && <PlanTab key={courseId} courseId={courseId} />}
      {active === 'notices' && <ItemsTab key={courseId} courseId={courseId} tab="notices" emptyTitle={t('course.noNotices')} />}
      {active === 'board' && <ItemsTab key={courseId} courseId={courseId} tab="board" emptyTitle={t('course.noBoard')} />}
      {active === 'materials' && <ItemsTab key={courseId} courseId={courseId} tab="materials" emptyTitle={t('course.noMaterials')} />}
      {active === 'tasks' && <ItemsTab key={courseId} courseId={courseId} tab="tasks" emptyTitle={t('course.noTasks')} />}
      {active === 'scores' && <ScoresTab key={courseId} courseId={courseId} />}
      {active === 'attendance' && <AttendanceTab key={courseId} courseId={courseId} />}
    </>
  )
}
