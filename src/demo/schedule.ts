import { LESSON_TIMES } from '../lib/timetable/model.ts'
import type { GridBlock, SchedulePage, ScheduleView } from '../api/types.ts'

// Sample data for demo mode. Every person, email and number here is made up.

// The timetable the API returns when the university has no lessons: the schedule channel's PDFs, one block per group.
// `view=list` gives a row per session, and `view=grid` a grid per group. The values are the API's: English weekdays,
// `lecture` or `lab`, and `upper`, `lower` or `both` for the week.
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const EVERY_WEEK = 'both'
const ALT_WEEK = 'lower'
const UST_WEEK = 'upper'

interface DemoCard {
  day: number // index into WEEKDAYS
  time: string
  week: string
  letter: 'M' | 'S' // M is a lecture, S a lab
  course: string
  room: string
  teacher: string
}

const groups: Record<string, DemoCard[]> = {
  // Made-up names, shaped like the export: a course with no teacher, a card with no room, cards for one week only, and
  // an identical card repeated in a cell.
  M1: [
    { day: 0, time: '19:00-20:20', week: EVERY_WEEK, letter: 'M', course: 'M101/M102 Discrete Mathematics', room: '5-401', teacher: '' },
    { day: 0, time: '20:30-21:50', week: EVERY_WEEK, letter: 'S', course: 'Python for Data Engineering (Git, Docker, SQL)', room: '5-500', teacher: 'Dr. Nigar Ismayilova' },
    { day: 1, time: '19:00-20:20', week: UST_WEEK, letter: 'S', course: 'Software Quality', room: '', teacher: 'Dr. Kamran Huseynov' },
    { day: 1, time: '19:00-20:20', week: UST_WEEK, letter: 'S', course: 'Software Quality', room: '', teacher: 'Dr. Kamran Huseynov' },
    { day: 1, time: '20:30-21:50', week: ALT_WEEK, letter: 'S', course: 'Data Structures and Algorithms', room: '3-319', teacher: 'Dr. Tural Rzayev' },
    { day: 1, time: '20:30-21:50', week: ALT_WEEK, letter: 'S', course: 'Data Structures and Algorithms', room: '3-319', teacher: 'Dr. Tural Rzayev' },
    { day: 1, time: '20:30-21:50', week: UST_WEEK, letter: 'S', course: 'Machine Learning Models', room: '', teacher: 'Prof. Rashad Aliyev' },
    { day: 1, time: '20:30-21:50', week: UST_WEEK, letter: 'S', course: 'Machine Learning Models', room: '', teacher: 'Prof. Rashad Aliyev' },
    { day: 2, time: '19:00-20:20', week: EVERY_WEEK, letter: 'M', course: 'Machine Learning Models', room: '1-511a', teacher: 'Prof. Rashad Aliyev' },
    { day: 2, time: '20:30-21:50', week: EVERY_WEEK, letter: 'M', course: 'Data Structures and Algorithms', room: '3-405', teacher: 'Dr. Tural Rzayev' },
    { day: 3, time: '20:30-21:50', week: EVERY_WEEK, letter: 'M', course: 'Software Quality', room: '3-401', teacher: 'Dr. Kamran Huseynov' },
  ],
  M2: [
    { day: 0, time: '13:35-14:55', week: EVERY_WEEK, letter: 'M', course: 'Linear Algebra', room: '3-07', teacher: 'Dr. Tural Rzayev' },
    { day: 2, time: '10:30-11:50', week: ALT_WEEK, letter: 'M', course: 'Algorithms', room: '2-02', teacher: 'Dr. Vugar Huseynov' },
    { day: 4, time: '10:30-11:50', week: UST_WEEK, letter: 'S', course: 'Machine Learning', room: 'Lab 3', teacher: 'Dr. Leyla Mammadova' },
  ],
}

const startOf = (time: string) => {
  const [hours, minutes] = time.split('-')[0].split(':').map(Number)
  return hours * 60 + minutes
}

const typeOf = (card: DemoCard) => (card.letter === 'M' ? 'lecture' : 'lab')

function listRows(cards: DemoCard[]): Record<string, string>[] {
  return [...cards]
    .sort((a, b) => a.day - b.day || startOf(a.time) - startOf(b.time))
    .map((card) => ({
      day: WEEKDAYS[card.day],
      time: card.time,
      week: card.week,
      course: card.course,
      type: typeOf(card),
      room: card.room,
      teacher: card.teacher,
    }))
}

/** One group's grid as `view=grid` gives it: every weekday, and a cell for every lesson time. */
function gridBlock(title: string, cards: DemoCard[]): GridBlock {
  return {
    title,
    times: LESSON_TIMES,
    days: WEEKDAYS.map((day, dayIndex) => ({
      day,
      lessons: LESSON_TIMES.map((time) => ({
        time,
        cards: cards
          .filter((card) => card.day === dayIndex && card.time === time)
          .map((card) => ({
            type: typeOf(card),
            week: card.week,
            course: card.course,
            teacher: card.teacher,
            room: card.room,
          })),
      })),
    })),
  }
}

/**
 * The schedule as `GET /me/schedule?view=` returns it. `list` fills `sections`, and `grid` fills `grids` and leaves
 * `sections` empty. Either way there is one block per group, titled the way the API titles it.
 */
export function scheduleFor(view: ScheduleView): SchedulePage {
  const blocks = Object.entries(groups)
  return {
    name: 'Schedule',
    url: '',
    sections: {
      semesters:
        view === 'list' ? blocks.map(([group, cards]) => ({ title: `${group} Dərs cədvəli`, rows: listRows(cards) })) : [],
    },
    grids: view === 'grid' ? blocks.map(([group, cards]) => gridBlock(`${group} Dərs cədvəli`, cards)) : [],
  }
}
