import { Chip } from '@mui/material'
import type { Letter } from '../../lib/grades.ts'

const TONE = { A: 'success', B: 'success', C: 'info', D: 'warning', E: 'warning', F: 'error' } as const

/** A letter grade as a chip. A simulated one is outlined, so it is not mistaken for a published result. */
export default function LetterChip({ letter, simulated = false }: { letter: Letter; simulated?: boolean }) {
  return (
    <Chip
      size="small"
      color={TONE[letter]}
      variant={simulated ? 'outlined' : 'filled'}
      label={letter}
      sx={{ minWidth: 32, fontWeight: 700, flexShrink: 0 }}
    />
  )
}
