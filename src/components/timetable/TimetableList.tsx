import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { weekdayLabel } from '../../i18n/index.ts'
import { buildList } from '../../lib/timetable/model.ts'
import { filterDaysWeek, type Week } from '../../lib/timetable/week.ts'
import SessionRow from './SessionRow.tsx'
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
