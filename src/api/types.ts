// Response shapes of the AZTUSP backend (https://aztuapi.alakbaroff.com/openapi.json).

export interface Section<Row = Record<string, string>> {
  title: string | null
  rows: Row[]
}

export interface Envelope {
  name: string
  url: string
}

export interface StudentInfo {
  student_id: string
  exam_password: string
  last_name: string
  first_name: string
  father_name: string
  id_card_number: string
  gender: string
  education_type: string
  english_name: string
  phone: string
  address: string
  mobile_phone: string
  study_form: string
  language_track: string
  faculty: string
  department: string
  major: string
  specialization: string
  birth_date: string
  year_of_study: string
  status: string
  high_school: string
  high_school_graduation_date: string
  admission_date: string
  graduation_date: string
}

export interface ProfilePage extends Envelope {
  pairs: { info: StudentInfo }
}

export interface SemesterSummary {
  semester: string
  total_courses: string
  attended_courses: string
  total_credits: string
  earned_credits: string
  final_average: string
}

export interface CourseResult {
  course_type: string
  course: string
  credits: string
  column_4: string
  column_5: string
  final_score: string
  grade: string
  retake: string
}

export interface ScoresPage extends Envelope {
  tables: {
    student: { faculty_department: string; student_id: string; first_name: string; status: string }[]
    semesters: SemesterSummary[]
  }
  totals: { semesters: SemesterSummary | null }
  sections: { semester_courses: Section<CourseResult>[] }
}

export interface SchedulePage extends Envelope {
  sections: { semesters: Section[] }
}

export interface NoticeRow {
  id: string
  number: string
  section: string
  subject: string
  author: string
  created_at: string
  views: string
}

export interface NoticesPage extends Envelope {
  tables: { notices: NoticeRow[] }
}

export interface NoticeAttachment {
  name: string
  url: string
  file_no: string
  download: string
}

export interface NoticeDetail {
  id: string
  url: string
  subject: string
  author: string
  created_at: string
  views: string
  attachments: NoticeAttachment[]
  body: string
}

export interface Course {
  lec_open_idx: string
  sem_code: string | null
  name: string
  path: string
}

export interface PlanBlock {
  title: string
  rows?: Record<string, string>[] | null
  text?: string | null
}

export interface LecturePlan {
  params: Record<string, string>
  course: string | null
  semester?: string | null
  info?: Record<string, string> | null
  blocks?: PlanBlock[]
}

export interface CourseItems {
  params: Record<string, string>
  course: string | null
  items: Record<string, string>[]
}

export interface ScoreComponent {
  name: string
  max: string | null
  score: string | null
}

export interface CourseScores {
  params: Record<string, string>
  course: string | null
  table: Record<string, string>[]
  components: ScoreComponent[]
  total: string | null
  notes: string[]
}

export interface AttendanceSession {
  number: string
  date: string | null
  journal_date: string | null
}

export interface AttendanceMark {
  session: string
  status: string | null
  mark: 'present' | 'absent' | 'not_entered' | null
}

export interface AttendanceStudent {
  number: string
  student_id: string
  name: string
  marks: AttendanceMark[]
  score: string | null
  percent: string | null
}

export interface CourseAttendance {
  params: Record<string, string>
  course: string | null
  info: Record<string, string>
  legend: Record<string, string>
  header: Record<string, string | null>
  sessions: AttendanceSession[]
  students: AttendanceStudent[]
}

export type CourseTab = 'notices' | 'board' | 'materials' | 'tasks'
