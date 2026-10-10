import type {
  CourseResult,
  NoticeAttachment,
  NoticeDetail,
  NoticeRow,
  NoticesPage,
  ProfilePage,
  ScoresPage,
  SchedulePage,
  Subscription,
  TelegramStatus,
} from '../api/types.ts'

// Sample data for demo mode. Every person, email and number here is made up.

/** Shown in the sign-in field in demo mode, and as the signed-in name until the profile loads. */
export const DEMO_USERNAME = 'come in my friend'

export const DEMO_STUDENT_ID = 'M2400123'

// Demo downloads are answered locally with this text, under a path that never reaches the API.
export const ATTACHMENT_PATH = '/demo/attachments/'
export const attachmentText = 'This is a sample file from demo mode. No real document is included.'

export const profile: ProfilePage = {
  name: 'Profile',
  url: '',
  pairs: {
    info: {
      student_id: DEMO_STUDENT_ID,
      exam_password: '',
      last_name: 'Hasanov',
      first_name: 'Ramin',
      father_name: 'Elmar',
      id_card_number: 'AA0000000',
      gender: 'Male',
      education_type: "Bachelor's",
      english_name: 'Ramin Hasanov',
      phone: '+994 00 000 00 00',
      address: 'Baku, Example street 1',
      mobile_phone: '+994 00 000 00 00',
      study_form: 'Full-time',
      language_track: 'English',
      faculty: 'Faculty of Information Technologies',
      department: 'Department of Software Engineering',
      major: 'Software Engineering',
      specialization: 'Software development',
      birth_date: '2005-03-15',
      year_of_study: '3',
      status: 'Active',
      high_school: 'Example High School No. 1',
      high_school_graduation_date: '2021-06-15',
      admission_date: '2024-09-01',
      graduation_date: '',
    },
  },
}

function result(course: string, type: string, final: string, grade: string, retake = ''): CourseResult {
  return { course_type: type, course, credits: '6', column_4: '', column_5: '', final_score: final, grade, retake }
}

// Four finished semesters. Each semester's average is the mean of its five final scores.
const terms = [
  {
    semester: '2024-2025/1',
    average: '81.6',
    earned: '30',
    courses: [
      result('Introduction to Programming', 'Core', '91', 'A'),
      result('Calculus I', 'Core', '78', 'C'),
      result('Linear Algebra', 'Core', '84', 'B'),
      result('Discrete Mathematics', 'Core', '80', 'B'),
      result('Academic English', 'General', '75', 'C'),
    ],
  },
  {
    semester: '2024-2025/2',
    average: '79.0',
    earned: '30',
    courses: [
      result('Object-Oriented Programming', 'Core', '88', 'B'),
      result('Calculus II', 'Core', '71', 'C'),
      result('Digital Logic', 'Core', '83', 'B'),
      result('Physics for Engineers', 'Core', '69', 'D'),
      result('Philosophy', 'General', '84', 'B'),
    ],
  },
  {
    semester: '2025-2026/1',
    average: '73.4',
    earned: '24',
    courses: [
      result('Data Structures', 'Core', '74', 'C'),
      result('Probability Basics', 'Core', '81', 'B'),
      result('Database Fundamentals', 'Core', '45', 'F', 'Y'),
      result('Web Development Basics', 'Elective', '90', 'A'),
      result('Economics', 'General', '77', 'C'),
    ],
  },
  {
    semester: '2025-2026/2',
    average: '79.0',
    earned: '30',
    courses: [
      result('Algorithms', 'Core', '86', 'B'),
      result('Statistics', 'Core', '79', 'C'),
      result('Computer Architecture', 'Core', '73', 'C'),
      result('Software Design', 'Elective', '82', 'B'),
      result('Technical English', 'General', '75', 'C'),
    ],
  },
]

export const scores: ScoresPage = {
  name: 'Scores',
  url: '',
  tables: {
    student: [
      {
        faculty_department: 'Faculty of Information Technologies / Software Engineering',
        student_id: DEMO_STUDENT_ID,
        first_name: 'Ramin',
        status: 'Active',
      },
    ],
    semesters: terms.map((term) => ({
      semester: term.semester,
      total_courses: '5',
      attended_courses: '5',
      total_credits: '30',
      earned_credits: term.earned,
      final_average: term.average,
    })),
  },
  totals: {
    semesters: {
      semester: 'Total',
      total_courses: '20',
      attended_courses: '20',
      total_credits: '120',
      earned_credits: '114',
      final_average: '78.3',
    },
  },
  sections: {
    semester_courses: terms.map((term) => ({ title: term.semester, rows: term.courses })),
  },
}

const lessons: Record<string, string>[] = [
  { day: 'Monday', time: '09:00-10:30', course: 'Database Systems', type: 'Lecture', room: '2-14', teacher: 'Dr. Nigar Ismayilova' },
  { day: 'Monday', time: '11:00-12:30', course: 'Probability and Statistics', type: 'Lecture', room: '3-07', teacher: 'Dr. Tural Rzayev' },
  { day: 'Tuesday', time: '10:00-11:30', course: 'Operating Systems', type: 'Lecture', room: '2-09', teacher: 'Prof. Rashad Aliyev' },
  { day: 'Tuesday', time: '13:00-14:30', course: 'Database Systems', type: 'Lab', room: 'Lab 4', teacher: 'Dr. Nigar Ismayilova' },
  { day: 'Wednesday', time: '09:00-10:30', course: 'Computer Networks', type: 'Lecture', room: '1-05', teacher: 'Dr. Kamran Huseynov' },
  { day: 'Wednesday', time: '14:00-15:30', course: 'Operating Systems', type: 'Lab', room: 'Lab 2', teacher: 'Prof. Rashad Aliyev' },
  { day: 'Thursday', time: '11:00-12:30', course: 'Software Engineering', type: 'Lecture', room: '3-12', teacher: 'Dr. Leyla Mammadova' },
  { day: 'Friday', time: '09:00-10:30', course: 'Computer Networks', type: 'Lab', room: 'Lab 1', teacher: 'Dr. Kamran Huseynov' },
]

export const schedule: SchedulePage = {
  name: 'Schedule',
  url: '',
  sections: { semesters: [{ title: '2026-2027/1', rows: lessons }] },
}

const notices: { row: NoticeRow; body: string; files?: string[] }[] = [
  {
    row: { id: '1041', number: '1041', section: 'Exams', subject: 'Final exam timetable published', author: 'Registrar', created_at: '2026-10-08', views: '412' },
    body: 'The final exam timetable for the 2026-2027 fall semester is now available. Check your room and time, and bring your student card to every exam.',
    files: ['Exam timetable (demo).txt'],
  },
  {
    row: { id: '1040', number: '1040', section: 'Registration', subject: 'Course registration for spring opens', author: 'Registrar', created_at: '2026-10-05', views: '286' },
    body: 'Registration for the spring semester opens on 20 October and stays open for two weeks. Choose your courses in the student portal.',
  },
  {
    row: { id: '1039', number: '1039', section: 'General', subject: 'Library closed on a public holiday', author: 'Library', created_at: '2026-10-02', views: '130' },
    body: 'The library will be closed on the public holiday. Normal opening hours resume the next day.',
  },
  {
    row: { id: '1038', number: '1038', section: 'Scholarship', subject: 'Scholarship applications for next semester', author: 'Student affairs', created_at: '2026-09-29', views: '357' },
    body: 'Applications for the merit scholarship are open. Submit the form and your latest transcript before the deadline. Late forms are not accepted.',
    files: ['Application form (demo).txt'],
  },
  {
    row: { id: '1037', number: '1037', section: 'Events', subject: 'Career fair in the main hall', author: 'Career center', created_at: '2026-09-24', views: '198' },
    body: 'Local and international companies will meet students in the main hall. Bring a copy of your CV.',
  },
  {
    row: { id: '1036', number: '1036', section: 'Academic', subject: 'Room changes for Monday lectures', author: 'Department of Software Engineering', created_at: '2026-09-18', views: '74' },
    body: 'Some Monday lectures have moved to new rooms. The department timetable is updated on the notice board.',
  },
  {
    row: { id: '1035', number: '1035', section: 'General', subject: 'Campus Wi-Fi maintenance on Saturday', author: 'IT department', created_at: '2026-09-12', views: '221' },
    body: 'The campus Wi-Fi will be unavailable on Saturday from 22:00 to 02:00 while the network is upgraded.',
  },
  {
    row: { id: '1034', number: '1034', section: 'Exams', subject: 'Summer exam session results', author: 'Registrar', created_at: '2026-09-04', views: '509' },
    body: 'Results of the summer exam session are now published on the student portal. Contact the registrar if a result looks wrong.',
    files: ['Results summary (demo).txt'],
  },
]

export const noticesPage: NoticesPage = {
  name: 'Notices',
  url: '',
  tables: { notices: notices.map(({ row }) => row) },
}

export const noticeDetails: NoticeDetail[] = notices.map(({ row, body, files = [] }) => ({
  id: row.id,
  url: '',
  subject: row.subject,
  author: row.author,
  created_at: row.created_at,
  views: row.views,
  body,
  attachments: files.map<NoticeAttachment>((name, index) => {
    const fileNo = `${row.id}-${index + 1}`
    return { name, url: '', file_no: fileNo, download: `${ATTACHMENT_PATH}${fileNo}` }
  }),
}))

export const subscription: Subscription = {
  email: 'student@example.com',
  fields: ['final_score', 'grade'],
  telegram_linked: false,
  status: 'ok',
  last_checked_at: '2026-10-10T06:30:00Z',
}

export const telegram: TelegramStatus = { linked: false }
