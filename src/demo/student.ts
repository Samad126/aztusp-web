import type { CourseResult, ProfilePage, ScoresPage, Subscription, TelegramStatus } from '../api/types.ts'

// Sample data for demo mode. Every person, email and number here is made up.

/** Shown in the sign-in field in demo mode, and as the signed-in name until the profile loads. */
export const DEMO_USERNAME = 'come in my friend'

export const DEMO_STUDENT_ID = 'M2400123'

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

export const subscription: Subscription = {
  email: 'student@example.com',
  fields: ['final_score', 'grade'],
  telegram_linked: false,
  status: 'ok',
  last_checked_at: '2026-10-10T06:30:00Z',
}

export const telegram: TelegramStatus = { linked: false }
