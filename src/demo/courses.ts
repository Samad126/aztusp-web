import type {
  AttendanceMark,
  AttendanceSession,
  AttendanceStudent,
  Course,
  CourseAttendance,
  CourseItems,
  CourseScores,
  LecturePlan,
} from '../api/types.ts'
import { DEMO_STUDENT_ID } from './data.ts'

const SEMESTER = '2026-2027/1'
const SESSION_COUNT = 12
// Sessions that have already happened. The rest are still to come, so they have no date.
const HELD = 5
// The first session is a Tuesday in September 2026.
const FIRST_SESSION_UTC = Date.UTC(2026, 8, 8)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const SESSION_NUMBERS = Array.from({ length: SESSION_COUNT }, (_, index) => String(index + 1))

// Classmates in every journal. The first entry is the demo student.
const STUDENTS: [id: string, name: string][] = [
  [DEMO_STUDENT_ID, 'Ramin Hasanov'],
  ['M2400118', 'Murad Aliyev'],
  ['M2400104', 'Nigar Karimova'],
  ['M2400131', 'Farid Guliyev'],
  ['M2400097', 'Lamiya Ahmadova'],
  ['M2400140', 'Orkhan Safarov'],
  ['M2400112', 'Gunel Rustamova'],
  ['M2400106', 'Elvin Jafarov'],
  ['M2400128', 'Sevinj Mammadli'],
  ['M2400101', 'Rashad Nasibov'],
  ['M2400135', 'Konul Ibrahimova'],
  ['M2400119', 'Ulvi Bayramov'],
]

const sessions: AttendanceSession[] = SESSION_NUMBERS.map((number, index) => {
  const date = index < HELD ? new Date(FIRST_SESSION_UTC + index * WEEK_MS).toISOString().slice(0, 10) : null
  return { number, date, journal_date: date }
})

// Some marks are absent, spread over the students and courses so the rates differ.
function journal(courseIndex: number): AttendanceStudent[] {
  return STUDENTS.map(([studentId, name], student) => {
    const marks = SESSION_NUMBERS.map<AttendanceMark>((session, index) => {
      if (index >= HELD) return { session, status: null, mark: null }
      const absent = (student * 7 + index * 3 + courseIndex) % 10 === 0
      return absent ? { session, status: '−', mark: 'absent' } : { session, status: '+', mark: 'present' }
    })
    const present = marks.filter((mark) => mark.mark === 'present').length
    return {
      number: String(student + 1),
      student_id: studentId,
      name,
      marks,
      score: String(present * 2),
      percent: String(Math.round((present / HELD) * 100)),
    }
  })
}

interface CourseSpec {
  id: string
  name: string
  teacher: string
  topics: string[]
  graded: { name: string; max: number; score: number }[]
  notes: string[]
  notices: Record<string, string>[]
  board: Record<string, string>[]
  materials: Record<string, string>[]
  tasks: Record<string, string>[]
}

export interface DemoCourse {
  course: Course
  plan: LecturePlan
  items: Record<'notices' | 'board' | 'materials' | 'tasks', CourseItems>
  scores: CourseScores
  attendance: CourseAttendance
}

function makeCourse(spec: CourseSpec, index: number): DemoCourse {
  const params = { lec_open_idx: spec.id, sem_code: SEMESTER }
  const wrap = (rows: Record<string, string>[]): CourseItems => ({ params, course: spec.name, items: rows })

  return {
    course: { lec_open_idx: spec.id, sem_code: SEMESTER, name: spec.name, path: '' },
    plan: {
      params,
      course: spec.name,
      semester: SEMESTER,
      info: { teacher: spec.teacher, credits: '6', total_hours: '96' },
      blocks: [
        {
          title: 'Weekly topics',
          rows: spec.topics.map((topic, week) => ({ week: String(week + 1), topic, hours: '6' })),
        },
        { title: 'Assessment', text: 'Points come from the midterm, the activity grade and the final exam.' },
      ],
    },
    items: {
      notices: wrap(spec.notices),
      board: wrap(spec.board),
      materials: wrap(spec.materials),
      tasks: wrap(spec.tasks),
    },
    scores: {
      params,
      course: spec.name,
      table: spec.graded.map((part, number) => ({
        number: String(number + 1),
        name: part.name,
        max: String(part.max),
        score: String(part.score),
      })),
      components: spec.graded.map((part) => ({ name: part.name, max: String(part.max), score: String(part.score) })),
      total: String(spec.graded.reduce((sum, part) => sum + part.score, 0)),
      notes: spec.notes,
    },
    attendance: {
      params,
      course: spec.name,
      info: { teacher: spec.teacher, total_hours: '96' },
      legend: { Present: '+', Absent: '−' },
      header: {},
      sessions,
      students: journal(index),
    },
  }
}

const specs: CourseSpec[] = [
  {
    id: '2001',
    name: 'Database Systems',
    teacher: 'Dr. Nigar Ismayilova',
    topics: ['Introduction to databases', 'The relational model', 'Relational algebra', 'SQL: queries and joins', 'Normalization', 'Transactions and concurrency', 'Indexes and query plans', 'NoSQL overview'],
    graded: [
      { name: 'Midterm', max: 30, score: 24 },
      { name: 'Activity', max: 20, score: 17 },
    ],
    notes: ['The final exam (50 points) is not graded yet.'],
    notices: [
      { title: 'Lab 2 moved to Thursday', author: 'Dr. Nigar Ismayilova', date: '2026-10-07' },
      { title: 'Midterm covers weeks 1 to 7', author: 'Dr. Nigar Ismayilova', date: '2026-09-22' },
    ],
    board: [{ title: 'Which normal form does the project need?', author: 'Murad Aliyev', date: '2026-10-03', replies: '4' }],
    materials: [
      { title: 'Weeks 1 to 4 slides', author: 'Dr. Nigar Ismayilova', date: '2026-09-10' },
      { title: 'SQL practice set', author: 'Dr. Nigar Ismayilova', date: '2026-09-17' },
    ],
    tasks: [
      { title: 'Lab 1: ER diagram', task_type: 'Lab', start_date: '2026-09-15', end_date: '2026-09-29', evaluation: '10' },
      { title: 'Project proposal', task_type: 'Project', start_date: '2026-10-06', end_date: '2026-10-27', evaluation: '20' },
    ],
  },
  {
    id: '2002',
    name: 'Operating Systems',
    teacher: 'Prof. Rashad Aliyev',
    topics: ['Processes and threads', 'CPU scheduling', 'Synchronization', 'Deadlocks', 'Memory management', 'Virtual memory', 'File systems', 'I/O and devices'],
    graded: [
      { name: 'Midterm', max: 30, score: 21 },
      { name: 'Activity', max: 20, score: 19 },
    ],
    notes: ['The final exam (50 points) is not graded yet.'],
    notices: [{ title: 'Tuesday lecture moved to room 2-09', author: 'Prof. Rashad Aliyev', date: '2026-10-06' }],
    board: [
      { title: 'Is the lab report due before the seminar?', author: 'Sevinj Mammadli', date: '2026-10-01', replies: '2' },
      { title: 'Good reading for virtual memory?', author: 'Elvin Jafarov', date: '2026-09-26', replies: '1' },
    ],
    materials: [
      { title: 'Lecture 1: processes', author: 'Prof. Rashad Aliyev', date: '2026-09-09' },
      { title: 'Scheduling exercises', author: 'Prof. Rashad Aliyev', date: '2026-09-23' },
    ],
    tasks: [
      { title: 'Lab 1: shell and processes', task_type: 'Lab', start_date: '2026-09-16', end_date: '2026-09-30', evaluation: '10' },
      { title: 'Lab 2: threads', task_type: 'Lab', start_date: '2026-10-07', end_date: '2026-10-21', evaluation: '10' },
    ],
  },
  {
    id: '2003',
    name: 'Computer Networks',
    teacher: 'Dr. Kamran Huseynov',
    topics: ['Network models: OSI and TCP/IP', 'Physical and data link layers', 'IP addressing', 'Routing', 'TCP and UDP', 'HTTP and DNS', 'Network security basics', 'Wireless networks'],
    graded: [
      { name: 'Midterm', max: 30, score: 26 },
      { name: 'Activity', max: 20, score: 18 },
    ],
    notes: ['Scores are provisional until the department confirms them.'],
    notices: [{ title: 'Lab 1 is cancelled this week', author: 'Dr. Kamran Huseynov', date: '2026-10-05' }],
    board: [],
    materials: [{ title: 'Subnetting worksheet', author: 'Dr. Kamran Huseynov', date: '2026-09-18' }],
    tasks: [{ title: 'Packet capture report', task_type: 'Report', start_date: '2026-10-01', end_date: '2026-10-22', evaluation: '15' }],
  },
  {
    id: '2004',
    name: 'Probability and Statistics',
    teacher: 'Dr. Tural Rzayev',
    topics: ['Basic probability', 'Conditional probability and Bayes', 'Random variables', 'Common distributions', 'Expectation and variance', 'Sampling distributions', 'Estimation', 'Hypothesis testing'],
    graded: [
      { name: 'Midterm', max: 30, score: 15 },
      { name: 'Activity', max: 20, score: 14 },
    ],
    notes: ['The final exam (50 points) is not graded yet.'],
    notices: [],
    board: [{ title: 'Homework 2 deadline', author: 'Lamiya Ahmadova', date: '2026-10-08', replies: '3' }],
    materials: [{ title: 'Formula sheet', author: 'Dr. Tural Rzayev', date: '2026-09-12' }],
    tasks: [{ title: 'Homework 2', task_type: 'Homework', start_date: '2026-10-01', end_date: '2026-10-15', evaluation: '10' }],
  },
  {
    id: '2005',
    name: 'Software Engineering',
    teacher: 'Dr. Leyla Mammadova',
    topics: ['Process models', 'Requirements and user stories', 'Use cases', 'System design', 'Testing strategies', 'Version control and CI', 'Project planning', 'Maintenance and refactoring'],
    graded: [
      { name: 'Midterm', max: 30, score: 28 },
      { name: 'Activity', max: 20, score: 20 },
    ],
    notes: ['Scores are provisional until the department confirms them.'],
    notices: [{ title: 'Team formation for the course project', author: 'Dr. Leyla Mammadova', date: '2026-09-14' }],
    board: [{ title: 'Can we use another tool for diagrams?', author: 'Konul Ibrahimova', date: '2026-10-02', replies: '5' }],
    materials: [
      { title: 'Project brief', author: 'Dr. Leyla Mammadova', date: '2026-09-15' },
      { title: 'User story template', author: 'Dr. Leyla Mammadova', date: '2026-09-22' },
    ],
    tasks: [{ title: 'Team charter', task_type: 'Project', start_date: '2026-09-15', end_date: '2026-09-29', evaluation: '10' }],
  },
]

/** The current semester's courses, each with its plan, course tabs, scores and attendance journal. */
export const demoCourses: DemoCourse[] = specs.map(makeCourse)
