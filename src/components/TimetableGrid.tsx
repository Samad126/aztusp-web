import { useState, type KeyboardEvent } from 'react'
import { Box, Chip, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useTranslation } from 'react-i18next'
import { lessonTypeLabel, weekdayLabel, weekLabel } from '../i18n/index.ts'
import { filterGridWeek, openingTab, type ScheduleGrid, type ScheduleItem, type Week } from '../lib/timetable.ts'
import TimetableFrame from './TimetableFrame.tsx'

/**
 * Time slots across the top, weekdays down the side. On a phone there is no room for the columns, so each weekday gets
 * a tab and its lessons are listed by time instead. From a tablet up, the grid scrolls sideways and the weekday column stays in view.
 */
export default function TimetableGrid({
  grid: full,
  title,
  subtitle,
  week = null,
}: {
  grid: ScheduleGrid
  title?: string
  subtitle?: string
  /** The week to show, or `null` for every week. */
  week?: Week | null
}) {
  const { t } = useTranslation()
  const grid = filterGridWeek(full, week)
  // A time with lessons in it gets room for their cards. An empty time only needs room for its label.
  const filled = grid.slots.map((_, index) => grid.days.some((day) => day.cells[index].length > 0))

  return (
    <TimetableFrame title={title} subtitle={subtitle}>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <DayTabs grid={grid} />
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <TableContainer tabIndex={0} role="region" aria-label={title ?? t('schedule.title')} sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  component="th"
                  scope="col"
                  sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                    width: { xs: 108, md: 104 },
                    minWidth: { xs: 108, md: 104 },
                    borderRight: 1,
                    borderColor: 'divider',
                  }}
                >
                  {t('schedule.day')}
                </TableCell>
                {grid.slots.map((slot, index) => (
                  <TableCell
                    key={index}
                    component="th"
                    scope="col"
                    align="center"
                    sx={{
                      minWidth: filled[index] ? 160 : 96,
                      py: 1.5,
                      px: 0.5,
                      textTransform: 'none',
                      letterSpacing: 0,
                      fontSize: 13,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      color: 'text.primary',
                    }}
                  >
                    {slot}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {grid.days.map((day) => (
                <TableRow key={day.name}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      width: { xs: 108, md: 104 },
                      minWidth: { xs: 108, md: 104 },
                      px: 1.5,
                      py: 1.5,
                      verticalAlign: 'top',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'text.primary',
                      // Opaque, so the lessons scrolling underneath don't show through.
                      bgcolor: 'background.paper',
                      borderRight: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {weekdayLabel(day.index, day.name)}
                  </TableCell>
                  {day.cells.map((items, index) => (
                    <TableCell key={index} sx={{ verticalAlign: cellAlignment(items), p: 0.75, minWidth: filled[index] ? 160 : 96 }}>
                      <Stack spacing={0.75}>
                        {items.map((item, itemIndex) =>
                          item.text ? <TextCard key={itemIndex} text={item.text} /> : <LessonCard key={itemIndex} item={item} />,
                        )}
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </TimetableFrame>
  )
}

/** On a phone: one weekday at a time, with the lessons listed by time. Times with no lesson that day are left out. */
function DayTabs({ grid }: { grid: ScheduleGrid }) {
  const { t } = useTranslation()
  // Open on today's weekday in Baku time (Friday at the weekend), or the first weekday with lessons if today isn't shown.
  const [selected, setSelected] = useState(() => openingTab(grid.days))
  const current = Math.min(selected, Math.max(0, grid.days.length - 1))
  const day = grid.days[current]
  const rows = day ? grid.slots.map((slot, index) => ({ slot, items: day.cells[index] })).filter((row) => row.items.length > 0) : []

  return (
    <Box>
      <Tabs
        value={current}
        onChange={(_, value: number) => setSelected(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 44 }}
      >
        {grid.days.map((item, index) => (
          <Tab
            key={item.name}
            value={index}
            label={weekdayLabel(item.index, item.name)}
            sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44, px: 1.5 }}
          />
        ))}
      </Tabs>

      <Stack spacing={1.5} sx={{ p: 1.5 }}>
        {rows.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: 'text.primary', opacity: 0.7, px: 0.5 }}>{t('schedule.noLessonsDay')}</Typography>
        ) : (
          rows.map((row) => (
            <Box key={row.slot} sx={{ display: 'grid', gridTemplateColumns: '88px minmax(0, 1fr)', gap: 1.25, alignItems: 'start' }}>
              <Typography sx={{ pt: 1, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {row.slot}
              </Typography>
              <Stack spacing={0.75}>
                {row.items.map((item, index) =>
                  item.text ? <TextCard key={index} text={item.text} /> : <LessonCard key={index} item={item} />,
                )}
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  )
}

// A lone alt həftə lesson sits at the bottom of its cell and a lone üst həftə lesson at the top. Two or more stack from the top.
function cellAlignment(items: ScheduleItem[]) {
  return items.length === 1 && items[0].week === 'lower' ? 'bottom' : 'top'
}

/**
 * One lesson: its type, its week when it is in one week only, the course, the teacher and the room. The course name stays
 * on one line; a tap or a key press shows all of it.
 */
function LessonCard({ item }: { item: ScheduleItem }) {
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

/** A lesson the API gave only as text, shown as it was written. */
function TextCard({ text }: { text: string }) {
  return (
    <Box
      sx={(theme) => ({
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        borderLeft: 3,
        borderLeftColor: 'primary.main',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
        color: 'text.primary',
        fontSize: 12.5,
        lineHeight: 1.45,
        whiteSpace: 'pre-line',
        overflowWrap: 'anywhere',
      })}
    >
      {text}
    </Box>
  )
}
