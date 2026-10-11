import { Box, LinearProgress, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatPercent, percentTone, toNumber } from '../../lib/format.ts'
import { estimateOf, mineOf, type Row } from './rows.ts'

/**
 * The rate column: the portal's rate with its bar. With absences typed in, the bar and the new figure show the estimate,
 * and the portal's figure is struck through.
 */
export default function RateCell({ row, studentId, lessons }: { row: Row; studentId: string | undefined; lessons: number }) {
  const { i18n } = useTranslation()
  if (row.state === 'loading') return <LinearProgress sx={{ width: 120, ml: 'auto', borderRadius: 3 }} />
  if (row.state === 'error') return <Typography variant="body2" color="error">{row.error}</Typography>
  const percent = toNumber(mineOf(row, studentId)?.percent)
  if (percent === null) return '—'
  const estimated = lessons > 0 ? estimateOf(row, studentId, lessons) : null
  const shown = estimated ?? percent
  const tone = percentTone(shown)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: estimated === null ? 136 : 180, ml: 'auto' }}>
      <LinearProgress
        variant="determinate"
        color={tone === 'default' ? 'primary' : tone}
        value={Math.min(100, shown)}
        sx={{ width: 90, height: 6, borderRadius: 3, flexShrink: 0 }}
      />
      <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
        {estimated === null ? (
          `${percent}%`
        ) : (
          <>
            <Box component="s" sx={{ color: 'text.secondary', fontWeight: 400, mr: 1 }}>
              {formatPercent(percent, i18n.language)}
            </Box>
            {formatPercent(estimated, i18n.language)}
          </>
        )}
      </Typography>
    </Box>
  )
}
