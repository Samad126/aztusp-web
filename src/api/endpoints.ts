import type { CourseTab } from './types.ts'

const V1 = '/api/v1'

export const endpoints = {
  login: `${V1}/auth/login`,
  logout: `${V1}/auth/logout`,
  profile: `${V1}/me/profile`,
  notifications: `${V1}/me/notifications`,
  telegram: `${V1}/me/telegram`,
  telegramLink: `${V1}/me/telegram/link`,
  password: `${V1}/me/password`,
  scores: `${V1}/me/scores`,
  schedule: `${V1}/me/schedule`,
  notices: `${V1}/me/notices`,
  notice: (id: string) => `${V1}/me/notices/${encodeURIComponent(id)}`,
  courses: `${V1}/courses`,
  coursePlan: (id: string) => `${V1}/courses/${encodeURIComponent(id)}/plan`,
  courseTab: (id: string, tab: CourseTab) => `${V1}/courses/${encodeURIComponent(id)}/${tab}`,
  courseScores: (id: string) => `${V1}/courses/${encodeURIComponent(id)}/scores`,
  courseAttendance: (id: string) => `${V1}/courses/${encodeURIComponent(id)}/attendance`,
}
