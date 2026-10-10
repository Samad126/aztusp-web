import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PhotoAvatar from '../components/PhotoAvatar.tsx'
import StatCard from '../components/StatCard.tsx'
import KeyValueGrid from '../components/KeyValueGrid.tsx'
import { Async } from '../components/PageState.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import { usePhotoUrl } from '../api/photo.ts'
import type { Course, ProfilePage, ScoresPage } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import { initials } from '../lib/format.ts'

export default function HomePage() {
  const { t } = useTranslation()
  const profile = useApi<ProfilePage>(endpoints.profile)
  const scores = useApi<ScoresPage>(endpoints.scores)
  const courses = useApi<Course[]>(endpoints.courses)
  const photo = usePhotoUrl()

  const info = profile.data?.pairs.info
  const total = scores.data?.totals.semesters
  const fullName = info ? [info.last_name, info.first_name, info.father_name].filter(Boolean).join(' ') : ''

  return (
    <Stack spacing={3}>
      <Async loading={profile.loading} error={profile.error} onRetry={profile.reload} rows={3}>
        {info && (
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 3,
              p: 3,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <PhotoAvatar
              alt={fullName}
              src={photo}
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {initials(fullName)}
            </PhotoAvatar>
            <Box sx={{ flexGrow: 1, minWidth: 220 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {fullName || info.english_name}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {[info.faculty, info.major].filter(Boolean).join(' · ')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
                {info.status && <Chip size="small" color="primary" label={info.status} />}
                {info.student_id && <Chip size="small" variant="outlined" label={t('home.id', { id: info.student_id })} />}
                {info.year_of_study && <Chip size="small" variant="outlined" label={t('home.year', { n: info.year_of_study })} />}
              </Stack>
            </Box>
          </Paper>
        )}
      </Async>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        <StatCard
          icon={MenuBookOutlinedIcon}
          label={t('home.currentCourses')}
          value={courses.data ? courses.data.length : '…'}
        />
        <StatCard
          icon={SchoolOutlinedIcon}
          label={t('home.finalAverage')}
          value={total?.final_average || (scores.loading ? '…' : '—')}
          tone="success"
        />
        <StatCard
          icon={DonutLargeOutlinedIcon}
          label={t('home.totalCredits')}
          value={total?.total_credits || (scores.loading ? '…' : '—')}
          tone="info"
        />
        <StatCard
          icon={WorkspacePremiumOutlinedIcon}
          label={t('home.earnedCredits')}
          value={total?.earned_credits || (scores.loading ? '…' : '—')}
          tone="warning"
        />
        <StatCard
          icon={CalendarTodayOutlinedIcon}
          label={t('home.semesters')}
          value={scores.data ? scores.data.tables.semesters.length : '…'}
          tone="secondary"
        />
      </Box>

      {info && (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
            alignItems: 'start',
          }}
        >
          <KeyValueGrid
            title={t('home.personal')}
            items={[
              { label: t('profile.last_name'), value: info.last_name },
              { label: t('profile.first_name'), value: info.first_name },
              { label: t('profile.father_name'), value: info.father_name },
              { label: t('profile.english_name'), value: info.english_name },
              { label: t('profile.gender'), value: info.gender },
              { label: t('profile.birth_date'), value: info.birth_date },
              { label: t('profile.id_card_number'), value: info.id_card_number },
              { label: t('profile.mobile_phone'), value: info.mobile_phone },
              { label: t('profile.phone'), value: info.phone },
              { label: t('profile.address'), value: info.address },
            ]}
          />
          <KeyValueGrid
            title={t('home.academic')}
            items={[
              { label: t('profile.student_id'), value: info.student_id },
              { label: t('profile.faculty'), value: info.faculty },
              { label: t('profile.department'), value: info.department },
              { label: t('profile.major'), value: info.major },
              { label: t('profile.specialization'), value: info.specialization },
              { label: t('profile.education_type'), value: info.education_type },
              { label: t('profile.study_form'), value: info.study_form },
              { label: t('profile.language_track'), value: info.language_track },
              { label: t('profile.year_of_study'), value: info.year_of_study },
              { label: t('profile.status'), value: info.status },
              { label: t('profile.high_school'), value: info.high_school },
              { label: t('profile.high_school_graduation_date'), value: info.high_school_graduation_date },
              { label: t('profile.admission_date'), value: info.admission_date },
              { label: t('profile.graduation_date'), value: info.graduation_date },
            ]}
          />
        </Box>
      )}
    </Stack>
  )
}
