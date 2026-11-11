import { Chip } from '@mui/material'
import type { Letter } from '../../lib/grades.ts'

const TONE = { A: 'success', B: 'success', C: 'info', D: 'warning', E: 'warning', F: 'error' } as const

/** A letter grade as a chip. */
export default function LetterChip({ letter }: { letter: Letter }) {
  return (
    <Chip
      size="small"
      color={TONE[letter]}
      label={letter}
      sx={{ minWidth: 32, fontWeight: 700, flexShrink: 0 }}
    />
  )
}
