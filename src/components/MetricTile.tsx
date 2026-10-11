import type { ReactNode } from 'react'
import { Paper, Typography } from '@mui/material'
import type { Tone } from '../lib/format.ts'

/** A figure in a card: a caption over a large value, coloured by `tone` when it has one. `children` sits under the value. */
export default function MetricTile({
  label,
  value,
  tone = 'default',
  children,
}: {
  label: string
  value: ReactNode
  tone?: Tone
  children?: ReactNode
}) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: tone === 'default' ? 'text.primary' : `${tone}.main` }}>
        {value}
      </Typography>
      {children}
    </Paper>
  )
}
