import type { GridBlock } from '../../api/types.ts'

/** The lesson times the university prints across its timetable, in order. The channel's grid numbers its rows 1, 2, … in this order. */
export const LESSON_TIMES = [
  '9:00-10:20',
  '10:30-11:50',
  '12:00-13:20',
  '13:35-14:55',
  '15:05-16:25',
  '16:35-17:55',
  '19:00-20:20',
  '20:30-21:50',
]

/** The heading for a grid slot. A lesson number becomes its time; anything else already is a time and is kept. */
function slotTime(slot: string) {
  const number = Number(slot)
  return /^\d+$/.test(slot) && number >= 1 && number <= LESSON_TIMES.length ? LESSON_TIMES[number - 1] : slot
}

// The school week, Monday first. The channel's API writes the days in English; the university's own timetable writes
// them in Azerbaijani.
const WEEK = [
  ['monday', 'Bazar ertəsi'],
  ['tuesday', 'Çərşənbə axşamı'],
  ['wednesday', 'Çərşənbə'],
  ['thursday', 'Cümə axşamı'],
  ['friday', 'Cümə'],
]

/** The position of a day in the school week (0 for Monday), or undefined when the name is not one of the five. */
function weekdayIndex(name: string) {
  const key = name.trim().toLowerCase()
  const index = WEEK.findIndex((names) => names.some((known) => known.toLowerCase() === key))
  return index === -1 ? undefined : index
}

/**
 * One lesson. `type`, `week` and the rest are the API's values (`lecture`, `upper`…), shown translated by the UI. The
 * university's own timetable comes back as text, so its cells keep the text as they were given (`text`).
 */
export interface ScheduleItem {
  time: string
  week?: string
  course?: string
  type?: string
  room?: string
  teacher?: string
  text?: string
}

/** A school day. `index` is its place in the week (Monday is 0), and it is missing for a day that is not one of the five. */
export interface ScheduleDay {
  name: string
  index?: number
  items: ScheduleItem[]
}

/** One column per time and one row per weekday. Each cell lists the lessons in it, in the order they came. */
export interface ScheduleGrid {
  slots: string[]
  days: { name: string; index?: number; cells: ScheduleItem[][] }[]
}

// Row metadata the API can add next to the columns. It isn't a weekday, so it's left out (as RecordsTable does).
const METADATA_KEYS = new Set(['id', 'link'])

// The API joins the cards of one grid cell with " / ", so each card is shown on its own. The export repeats some cards
// in a cell, so an identical card is shown once.
function splitCards(text: string) {
  return [
    ...new Set(
      text
        .split(' / ')
        .map((card) => card.trim())
        .filter(Boolean),
    ),
  ]
}

const START = /^(\d{1,2}):(\d{2})/

// Labels that don't start with a time keep their place: they all compare as equal.
function byStart(a: string, b: string) {
  const start = (label: string) => {
    const match = START.exec(label)
    return match ? Number(match[1]) * 60 + Number(match[2]) : Infinity
  }
  const x = start(a)
  const y = start(b)
  return x === y ? 0 : x < y ? -1 : 1
}

// Lessons in one time slot: upper (üst) before lower (alt), then the lessons that run every week.
function weekRank(week?: string) {
  return week === 'upper' ? 0 : week === 'lower' ? 1 : 2
}

function byLessonOrder(a: ScheduleItem, b: ScheduleItem) {
  return byStart(slotTime(a.time), slotTime(b.time)) || weekRank(a.week) - weekRank(b.week)
}

/**
 * Turns the `list` rows (or the university's rows) into the school days, Monday to Friday, with their lessons in order.
 * Monday to Friday are always there, even with no lessons. Any other day the API gives comes after them.
 * A `list` row is already one session. A grid row (the university's timetable comes back in grid form whatever the view)
 * is split into one item per card, with its lesson slot as the time.
 */
export function buildList(rows: Record<string, string>[]): ScheduleDay[] {
  const names: string[] = []
  const items: { day: string; item: ScheduleItem }[] = []
  // An identical lesson is kept once.
  const seen = new Set<string>()
  const addDay = (name: string) => {
    if (!names.includes(name)) names.push(name)
  }
  const add = (day: string, item: ScheduleItem) => {
    const key = JSON.stringify([day, item])
    if (seen.has(key)) return
    seen.add(key)
    items.push({ day, item })
  }

  for (const row of rows) {
    if ('day' in row) {
      addDay(row.day ?? '')
      add(row.day ?? '', {
        time: row.time ?? '',
        week: row.week,
        course: row.course,
        type: row.type,
        room: row.room,
        teacher: row.teacher,
      })
      continue
    }

    const [slotKey, ...keys] = Object.keys(row)
    if (!slotKey) continue
    const slot = (row[slotKey] ?? '').trim()
    for (const day of keys.filter((key) => !METADATA_KEYS.has(key))) {
      addDay(day)
      for (const text of splitCards(row[day] ?? '')) add(day, { time: slot, text })
    }
  }

  const week: ScheduleDay[] = WEEK.map(([name], index) => ({ name, index, items: [] }))
  const others: ScheduleDay[] = []
  for (const name of names) {
    const lessons = items.filter((entry) => entry.day === name).map((entry) => entry.item)
    const index = weekdayIndex(name)
    if (index === undefined) others.push({ name, items: lessons.sort(byLessonOrder) })
    else week[index].items.push(...lessons)
  }
  for (const day of week) day.items.sort(byLessonOrder)
  return [...week, ...others]
}

/** The grid from the `grids` response: its times across the top, and each weekday's cards in each time. */
export function gridFromApi(block: GridBlock): ScheduleGrid {
  return {
    slots: block.times,
    days: block.days.map((day) => ({
      name: day.day,
      index: weekdayIndex(day.day),
      cells: block.times.map((time) => {
        const lesson = day.lessons.find((entry) => entry.time === time)
        // An identical card is kept once, as it is in the list.
        const seen = new Set<string>()
        return (lesson?.cards ?? [])
          .map((card) => ({
            time,
            week: card.week,
            course: card.course,
            type: card.type,
            room: card.room,
            teacher: card.teacher,
          }))
          .filter((item) => {
            const key = JSON.stringify(item)
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          .sort((a, b) => weekRank(a.week) - weekRank(b.week))
      }),
    })),
  }
}

/**
 * Lays the lessons of `buildList` out as a grid: a column for every lesson time (the usual lesson times, plus any others
 * the lessons use) and a row for every school day. Used for the university's own timetable, which has no `grids`.
 */
export function buildGrid(days: ScheduleDay[]): ScheduleGrid {
  const used = days.flatMap((day) => day.items.map((item) => slotTime(item.time)))
  const slots = [...new Set([...LESSON_TIMES, ...used])].sort(byStart)
  return {
    slots,
    days: days.map((day) => ({
      name: day.name,
      index: day.index,
      cells: slots.map((slot) => day.items.filter((item) => slotTime(item.time) === slot)),
    })),
  }
}
