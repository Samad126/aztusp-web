import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { weekdayLabel } from '../../i18n/index.ts'
import type { ScheduleGrid, ScheduleItem } from '../../lib/timetable/model.ts'
import { filterGridWeek, type Week } from '../../lib/timetable/week.ts'
import DayTabs from './DayTabs.tsx'
import LessonCard from './LessonCard.tsx'
import TextCard from './TextCard.tsx'
import TimetableFrame from './TimetableFrame.tsx'

/**
 * Time slots across the top, weekdays down the side. On a phone there is no room for the columns, so each weekday gets
 * a tab, and the weekdays swipe side to side with its lessons listed by time. From a tablet up, the grid scrolls sideways and the weekday column stays in view.
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

// A lone alt həftə lesson sits at the bottom of its cell and a lone üst həftə lesson at the top. Two or more stack from the top.
function cellAlignment(items: ScheduleItem[]) {
  return items.length === 1 && items[0].week === 'lower' ? 'bottom' : 'top'
}
