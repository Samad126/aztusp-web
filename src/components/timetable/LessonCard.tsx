import { useState, type KeyboardEvent } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useTranslation } from 'react-i18next'
import { lessonTypeLabel, weekLabel } from '../../i18n/index.ts'
import type { ScheduleItem } from '../../lib/timetable/model.ts'

/**
 * One lesson: its type, its week when it is in one week only, the course, the teacher and the room. The course name stays
 * on one line; a tap or a key press shows all of it.
 */
export default function LessonCard({ item }: { item: ScheduleItem }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const toggle = () => setExpanded((open) => !open)
  const isLab = item.type === 'lab'
  // A lesson in every week needs no week label; upper and lower lessons say which week they are in.
  const showWeek = item.week === 'upper' || item.week === 'lower'

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={toggle}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }
      }}
      sx={(theme) => {
        const accent = isLab ? theme.palette.warning.main : theme.palette.primary.main
        return {
          px: 1,
          py: 0.875,
          borderRadius: 1.5,
          borderLeft: 3,
          borderLeftColor: accent,
          bgcolor: alpha(accent, theme.palette.mode === 'dark' ? 0.12 : 0.08),
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          cursor: 'pointer',
          minWidth: 0,
        }
      }}
    >
      {(item.type || showWeek) && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', alignItems: 'center', columnGap: 1, rowGap: 1 }}>
          {item.type && (
            <Chip
              size="small"
              label={lessonTypeLabel(item.type)}
              color={isLab ? 'warning' : 'primary'}
              sx={{ height: 20, fontSize: 11, fontWeight: 700 }}
            />
          )}
          {showWeek && (
            <Chip
              size="small"
              variant="outlined"
              label={weekLabel(item.week ?? '')}
              sx={{ height: 22, fontSize: 11.5, fontWeight: 600, color: 'text.primary' }}
            />
          )}
        </Stack>
      )}

      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
        <MenuBookOutlinedIcon sx={{ fontSize: 16, mt: 0.125, flexShrink: 0 }} />
        <Typography
          title={item.course}
          sx={{
            fontSize: 12.5,
            fontWeight: 600,
            lineHeight: 1.35,
            minWidth: 0,
            overflowWrap: 'anywhere',
            whiteSpace: expanded ? 'normal' : 'nowrap',
            overflow: expanded ? 'visible' : 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.course}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
        <PersonOutlinedIcon sx={{ fontSize: 16, mt: 0.125, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.35, overflowWrap: 'anywhere' }}>
          {item.teacher || <Box component="span" sx={{ fontStyle: 'italic' }}>{t('lesson.noTeacher')}</Box>}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <MeetingRoomOutlinedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          {item.room || <Box component="span" sx={{ fontStyle: 'italic' }}>{t('lesson.noRoom')}</Box>}
        </Typography>
      </Stack>
    </Box>
  )
}
