import { useMemo } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useTranslation } from 'react-i18next'
import { lessonTypeLabel, weekdayLabel, weekLabel } from '../i18n/index.ts'
import { buildList, filterDaysWeek, type ScheduleItem, type Week } from '../lib/timetable.ts'
import TimetableFrame from './TimetableFrame.tsx'

/** The lessons as a list, one group per school day, with the time, subject, teacher, room and week of each. Days with no lessons are listed too. */
export default function TimetableList({
  rows,
  title,
  subtitle,
  week = null,
}: {
  rows: Record<string, string>[]
  title?: string
  subtitle?: string
  /** The week to show, or `null` for every week. */
  week?: Week | null
}) {
  const { t } = useTranslation()
  const days = useMemo(() => filterDaysWeek(buildList(rows), week), [rows, week])

  return (
    <TimetableFrame title={title} subtitle={subtitle}>
      <Stack spacing={3} sx={{ p: 2.5 }}>
        {days.map((day) => (
          <Box key={day.name}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25 }}>
              {weekdayLabel(day.index, day.name)}
            </Typography>
            {day.items.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: 'text.primary', opacity: 0.7, px: 0.5 }}>
                {t('schedule.noLessonsDay')}
              </Typography>
            ) : (
              <Stack spacing={1}>
                {day.items.map((item, index) => (
                  <SessionRow key={index} item={item} />
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>
    </TimetableFrame>
  )
}

function SessionRow({ item }: { item: ScheduleItem }) {
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
