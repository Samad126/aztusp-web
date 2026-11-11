import type { CourseGrades } from '../api/types.ts'
import { toNumber } from './format.ts'

/** Most points the final exam gives; the other 50 are earned during the semester. */
export const FINAL_MAX = 50

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

/** The digits typed into a simulation box as an exam score, kept within 0 to 50. Null when empty. */
export function parseFinal(value: string | undefined): number | null {
  if (!value) return null
  return Math.min(Number.parseInt(value, 10), FINAL_MAX)
}

/** The exam score used for a course: the real one once the portal has it, else the simulated one. */
export function examPoints(row: CourseGrades, simulated: string | undefined): { points: number | null; simulated: boolean } {
  const real = toNumber(row.final)
  if (real !== null) return { points: real, simulated: false }
  const guess = parseFinal(simulated)
  return { points: guess, simulated: guess !== null }
}

/** Course total (0-100), or null while there is no exam score, real or simulated. */
export function courseTotal(row: CourseGrades, simulated: string | undefined) {
  const exam = examPoints(row, simulated)
  if (exam.points === null) return null
  return { total: semesterPoints(row) + exam.points, simulated: exam.simulated }
}

/** Exam points needed to reach `minimum` in total; null when even a full exam is not enough. 0 when already reached. */
export function neededOnFinal(row: CourseGrades, minimum: number): number | null {
  const needed = Math.max(0, minimum - semesterPoints(row))
  return needed > FINAL_MAX ? null : Math.ceil(needed)
}

export type Scholarship = 'excellent' | 'incentive' | 'regular'

/**
 * Scholarship category from every course total of a semester: all 91-100 gives Əlaçı (excellent), all 71-100 with at
 * least one 91+ gives Zərbəçi (incentive), all 51-100 gives Adi (regular). Null when any course is below 51.
 */
export function scholarshipFor(totals: number[]): Scholarship | null {
  if (totals.length === 0 || totals.some((total) => total < 51)) return null
  if (totals.every((total) => total >= 91)) return 'excellent'
  if (totals.every((total) => total >= 71) && totals.some((total) => total >= 91)) return 'incentive'
  return 'regular'
}
