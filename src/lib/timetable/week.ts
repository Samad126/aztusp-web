import type { ScheduleDay, ScheduleGrid, ScheduleItem } from './model.ts'

/** A week of the term: `upper` is üst həftə, `lower` is alt həftə. */
export type Week = 'upper' | 'lower'

/** What the week filter shows: the week today falls in, every week, or one week. */
export type WeekFilter = 'current' | 'all' | Week

// Baku is UTC+4 all year. Weeks run Monday to Sunday and alternate, starting with üst in the week that holds 15 September.
const BAKU_OFFSET_MS = 4 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/** The Monday of the week that holds 15 September, as a UTC timestamp: the first week of the term. */
function termStart(year: number): number {
  const september15 = Date.UTC(year, 8, 15)
  const sinceMonday = (new Date(september15).getUTCDay() + 6) % 7 // Monday is 0, Sunday is 6
  return september15 - sinceMonday * DAY_MS
}

/** The week a date falls in, counted in Baku time from the term's first week: üst, then alt, then üst again. */
export function currentWeek(now: Date = new Date()): Week {
  const baku = new Date(now.getTime() + BAKU_OFFSET_MS)
  const year = baku.getUTCFullYear()
  const today = Date.UTC(year, baku.getUTCMonth(), baku.getUTCDate())
  // Before this year's term starts, the weeks still belong to last year's term.
  const start = today < termStart(year) ? termStart(year - 1) : termStart(year)
  const weekNumber = Math.floor((today - start) / DAY_MS / 7)
  return weekNumber % 2 === 0 ? 'upper' : 'lower'
}

/** Monday is 0 and Friday 4, in Baku time. Saturday and Sunday count as Friday, the last school day of the week. */
function todayWeekdayIndex(now: Date = new Date()): number {
  const day = new Date(now.getTime() + BAKU_OFFSET_MS).getUTCDay() // 0 is Sunday, 6 is Saturday
  return day === 0 || day === 6 ? 4 : day - 1
}

/**
 * The tab to open first: today's school day when the days include it, otherwise the first day that has lessons.
 * At the weekend that is Friday.
 */
export function openingTab(days: { index?: number; cells: unknown[][] }[], now: Date = new Date()): number {
  const today = days.findIndex((day) => day.index === todayWeekdayIndex(now))
  if (today !== -1) return today
  return Math.max(0, days.findIndex((day) => day.cells.some((cell) => cell.length > 0)))
}

/** The week a filter shows, or `null` when every week is shown. */
export function resolveWeek(filter: WeekFilter, now?: Date): Week | null {
  if (filter === 'all') return null
  if (filter === 'current') return currentWeek(now)
  return filter
}

// A lesson in every week is shown for either week, and so is a lesson the API gave no week for (the university's text).
function inWeek(item: ScheduleItem, week: Week | null) {
  return week === null || !item.week || item.week === 'both' || item.week === week
}

/** The school days, keeping the lessons of one week. */
export function filterDaysWeek(days: ScheduleDay[], week: Week | null): ScheduleDay[] {
  return days.map((day) => ({ ...day, items: day.items.filter((item) => inWeek(item, week)) }))
}

/** The grid, keeping the lessons of one week. */
export function filterGridWeek(grid: ScheduleGrid, week: Week | null): ScheduleGrid {
  return {
    ...grid,
    days: grid.days.map((day) => ({ ...day, cells: day.cells.map((cell) => cell.filter((item) => inWeek(item, week))) })),
  }
}
