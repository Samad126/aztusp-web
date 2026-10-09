/** `start_date` / `startDate` -> `Start date`. */
export function humanize(key: string) {
  const words = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Parses numbers the portal prints, including decimal commas. Returns null for blanks and text. */
export function toNumber(value: string | null | undefined) {
  if (value === null || value === undefined) return null
  const parsed = Number.parseFloat(value.replace('%', '').replace(',', '.').trim())
  return Number.isFinite(parsed) ? parsed : null
}

export function initials(name: string) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
  return letters.join('') || '?'
}

export function isUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

export type Tone = 'success' | 'info' | 'warning' | 'error' | 'default'

export function gradeTone(grade: string): Tone {
  const letter = grade.trim().toUpperCase().charAt(0)
  if (letter === 'A' || letter === 'B') return 'success'
  if (letter === 'C') return 'info'
  if (letter === 'D' || letter === 'E') return 'warning'
  if (letter === 'F') return 'error'
  return 'default'
}

/** Colour for a percentage where higher is better. */
export function percentTone(value: number | null): Tone {
  if (value === null) return 'default'
  if (value >= 70) return 'success'
  if (value >= 50) return 'warning'
  return 'error'
}
