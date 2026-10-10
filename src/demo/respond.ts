import { endpoints } from '../api/endpoints.ts'
import type { CourseTab } from '../api/types.ts'
import i18n from '../i18n/index.ts'
import { ATTACHMENT_PATH, attachmentText, noticeDetails, noticesPage, profile, schedule, scores, subscription, telegram } from './data.ts'
import { demoCourses } from './courses.ts'

const COURSE_TABS: CourseTab[] = ['notices', 'board', 'materials', 'tasks']

// Every GET the app makes, with the sample response for it.
const responses = new Map<string, unknown>([
  [endpoints.profile, profile],
  [endpoints.scores, scores],
  [endpoints.schedule, schedule],
  [endpoints.notices, noticesPage],
  [endpoints.notifications, subscription],
  [endpoints.telegram, telegram],
  [endpoints.courses, demoCourses.map((demo) => demo.course)],
])
for (const detail of noticeDetails) responses.set(endpoints.notice(detail.id), detail)
for (const demo of demoCourses) {
  const id = demo.course.lec_open_idx
  responses.set(endpoints.coursePlan(id), demo.plan)
  for (const tab of COURSE_TABS) responses.set(endpoints.courseTab(id, tab), demo.items[tab])
  responses.set(endpoints.courseScores(id), demo.scores)
  responses.set(endpoints.courseAttendance(id), demo.attendance)
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

/**
 * Answers a request made in demo mode from the sample data. It never calls fetch, so a demo session cannot
 * reach the API, and every write is refused so nothing changes on the university side.
 */
export function demoResponse(method: string, path: string): Response {
  if (method.toUpperCase() !== 'GET') return json({ detail: i18n.t('demo.readOnly') }, 403)
  if (path.startsWith(ATTACHMENT_PATH)) {
    return new Response(attachmentText, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
  const body = responses.get(path)
  // Anything without sample data, such as a profile photo, looks the same as it does for a student without one.
  return body === undefined ? json({ detail: 'Not part of the demo data.' }, 404) : json(body)
}
