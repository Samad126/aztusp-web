import type { CourseGrades } from '../api/types.ts'
import { toNumber } from './format.ts'

/** AzTU letter scale: the lowest total that earns each letter, best first. Below 51 is F. */
export const LETTER_SCALE = [
  { letter: 'A', min: 91, max: 100 },
  { letter: 'B', min: 81, max: 90 },
  { letter: 'C', min: 71, max: 80 },
  { letter: 'D', min: 61, max: 70 },
  { letter: 'E', min: 51, max: 60 },
] as const

export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export function letterFor(total: number): Letter {
  return LETTER_SCALE.find((step) => total >= step.min)?.letter ?? 'F'
}

/** Points earned before the exam: Quiz 1, midterm, quiz 2 and individual work. */
export function semesterPoints(row: CourseGrades): number {
  return [row.quiz1, row.midterm, row.quiz2, row.individual_work].reduce((sum, value) => sum + (toNumber(value) ?? 0), 0)
}

/** Course total (0-100), or null until the portal has the exam score. */
export function courseTotal(row: CourseGrades): number | null {
  const exam = toNumber(row.final)
  return exam === null ? null : semesterPoints(row) + exam
}
