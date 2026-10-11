import type { NoticeAttachment, NoticeDetail, NoticeRow, NoticesPage } from '../api/types.ts'

// Sample data for demo mode. Every person, email and number here is made up.

// Demo downloads are answered locally with this text, under a path that never reaches the API.
export const ATTACHMENT_PATH = '/demo/attachments/'
export const attachmentText = 'This is a sample file from demo mode. No real document is included.'

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
