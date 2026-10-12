import { LinearProgress, Stack, Typography } from '@mui/material'
import AbsenceStatusChip from './AbsenceStatusChip.tsx'
import StatusInfoButton from './StatusInfoButton.tsx'
import { statusOf, type Row } from './rows.ts'

/** The status column: the student's standing against the absence limit, with the typed lessons counted as missed. */
export default function StatusCell({ row, studentId, lessons }: { row: Row; studentId: string | undefined; lessons: number }) {
  if (row.state === 'loading') return <LinearProgress sx={{ width: 120, ml: 'auto', borderRadius: 3 }} />
  if (row.state === 'error') return <Typography variant="body2" color="error">{row.error}</Typography>
  const status = statusOf(row, studentId, lessons)
  if (!status) return '—'
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
      <AbsenceStatusChip status={status} />
      <StatusInfoButton />
    </Stack>
  )
}
