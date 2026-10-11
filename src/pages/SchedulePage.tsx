import { useState } from 'react'
import { Link, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import { Async, EmptyState, PageHeader } from '../components/PageState.tsx'
import TimetableGrid from '../components/timetable/TimetableGrid.tsx'
import TimetableList from '../components/timetable/TimetableList.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import { useTranslation } from 'react-i18next'
import type { SchedulePage as ScheduleData, ScheduleView } from '../api/types.ts'
import { weekLabel } from '../i18n/index.ts'
import { readStorage, writeStorage } from '../lib/storage.ts'
import { buildGrid, buildList, gridFromApi } from '../lib/timetable/model.ts'
import { currentWeek, resolveWeek, type WeekFilter } from '../lib/timetable/week.ts'

const VIEW_KEY = 'userhelper-schedule-view'

// The view the student last chose. Anything but a saved 'list' (including blocked storage) falls back to the grid.
function savedView(): ScheduleView {
  return readStorage(VIEW_KEY) === 'list' ? 'list' : 'grid'
}

function rememberView(view: ScheduleView) {
  writeStorage(VIEW_KEY, view)
}

export default function SchedulePage() {
  const { t } = useTranslation()
  const [view, setView] = useState<ScheduleView>(savedView)
  // The week filter starts on the week today falls in (Baku time, counted from 15 September).
  const [weekFilter, setWeekFilter] = useState<WeekFilter>('current')
  const week = resolveWeek(weekFilter)
  // The API fills `grids` for `view=grid` and `sections` for `view=list`. The university's own timetable is in `sections`
  // in both, so when `grids` is empty the sections are shown in the chosen view.
  const schedule = useApi<ScheduleData>(`${endpoints.schedule}?view=${view}`)
  const grids = schedule.data?.grids ?? []
  const semesters = schedule.data?.sections.semesters ?? []
  const source = schedule.data?.url

  return (
    <>
      <PageHeader
        title={t('schedule.title')}
        description={t('schedule.description')}
        actions={
          <Stack direction="row" sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            <TextField
              select
              size="small"
              label={t('schedule.week')}
              value={weekFilter}
              onChange={(event) => setWeekFilter(event.target.value as WeekFilter)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="current">{t('schedule.weekCurrent', { week: weekLabel(currentWeek()) })}</MenuItem>
              <MenuItem value="all">{t('schedule.weekAll')}</MenuItem>
              <MenuItem value="upper">{weekLabel('upper')}</MenuItem>
              <MenuItem value="lower">{weekLabel('lower')}</MenuItem>
            </TextField>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              aria-label={t('schedule.view')}
              onChange={(_, value: ScheduleView | null) => {
                if (!value) return
                setView(value)
                rememberView(value)
              }}
            >
              <ToggleButton value="grid" sx={{ px: 2, textTransform: 'none' }}>
                <ViewModuleOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
                {t('schedule.viewGrid')}
              </ToggleButton>
              <ToggleButton value="list" sx={{ px: 2, textTransform: 'none' }}>
                <ViewListOutlinedIcon fontSize="small" sx={{ mr: 0.75 }} />
                {t('schedule.viewList')}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
      />
      <Async loading={schedule.loading} error={schedule.error} onRetry={schedule.reload} rows={6}>
        {grids.length === 0 && semesters.length === 0 ? (
          <EmptyState title={t('schedule.empty')}>{t('schedule.emptyHint')}</EmptyState>
        ) : (
          <Stack spacing={3}>
            {grids.map((block, index) => (
              <TimetableGrid key={`grid-${index}`} title={block.title} grid={gridFromApi(block)} week={week} />
            ))}
            {semesters.map((semester, index) => {
              const title = semester.title ?? t('schedule.semester', { n: index + 1 })
              if (semester.rows.length === 0) {
                return (
                  <EmptyState key={`semester-${index}`} title={title}>
                    {t('schedule.noLessons')}
                  </EmptyState>
                )
              }
              return view === 'grid' ? (
                <TimetableGrid key={`semester-${index}`} title={title} grid={buildGrid(buildList(semester.rows))} week={week} />
              ) : (
                <TimetableList key={`semester-${index}`} title={title} rows={semester.rows} week={week} />
              )
            })}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('schedule.footnote')}
              {source && (
                <>
                  {' '}
                  <Link href={source} target="_blank" rel="noreferrer" underline="hover">
                    {t('schedule.source')}
                  </Link>
                </>
              )}
            </Typography>
          </Stack>
        )}
      </Async>
    </>
  )
}
