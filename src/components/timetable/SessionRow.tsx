import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useTranslation } from 'react-i18next'
import { lessonTypeLabel, weekLabel } from '../../i18n/index.ts'
import type { ScheduleItem } from '../../lib/timetable/model.ts'

/** One lesson in the list view: the time, then the course, teacher and room (or the text the university printed), with its week and type. */
export default function SessionRow({ item }: { item: ScheduleItem }) {
  const { t } = useTranslation()
  const isLab = item.type === 'lab'

  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: '112px minmax(0, 1fr) auto' },
        gap: { xs: 0.75, sm: 2 },
        alignItems: 'center',
        px: 1.5,
        py: 1.25,
        borderRadius: 1.5,
        borderLeft: 3,
        borderLeftColor: isLab ? 'warning.main' : 'primary.main',
        bgcolor: alpha(isLab ? theme.palette.warning.main : theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.06),
      })}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
        {item.time}
      </Typography>

      <Box sx={{ minWidth: 0 }}>
        {item.text ? (
          <Typography sx={{ fontSize: 13.5, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>{item.text}</Typography>
        ) : (
          <>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
              <MenuBookOutlinedIcon sx={{ fontSize: 16, mt: 0.25, flexShrink: 0 }} />
              <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{item.course}</Typography>
            </Stack>
            <Stack direction="row" spacing={2.5} sx={{ mt: 0.75, flexWrap: 'wrap', rowGap: 0.5 }}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                <PersonOutlinedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, overflowWrap: 'anywhere' }}>
                  {item.teacher || <Box component="span" sx={{ fontStyle: 'italic' }}>{t('lesson.noTeacher')}</Box>}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                <MeetingRoomOutlinedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, overflowWrap: 'anywhere' }}>
                  {item.room || <Box component="span" sx={{ fontStyle: 'italic' }}>{t('lesson.noRoom')}</Box>}
                </Typography>
              </Stack>
            </Stack>
          </>
        )}
      </Box>

      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
        {item.week && (
          <Chip
            size="small"
            variant="outlined"
            label={weekLabel(item.week)}
            sx={{ fontWeight: 600, color: 'text.primary' }}
          />
        )}
        {item.type && (
          <Chip
            size="small"
            label={lessonTypeLabel(item.type)}
            color={isLab ? 'warning' : 'primary'}
            sx={{ fontWeight: 700 }}
          />
        )}
      </Stack>
    </Box>
  )
}
