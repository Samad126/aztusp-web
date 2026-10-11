import { Box, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import type { AttendanceMark } from '../../../api/types.ts'

const markColor = {
  present: 'success',
  absent: 'error',
  not_entered: 'text',
} as const

/** One journal cell: the student's mark for a lesson, with the lesson's date and what the mark means on hover. */
export default function MarkCell({ mark, date }: { mark: AttendanceMark | undefined; date: string | null }) {
  const { t } = useTranslation()
  if (!mark) return <span>—</span>
  const tone = mark.mark ? markColor[mark.mark] : 'text'
  const label = mark.status || '·'
  return (
    <Tooltip title={`${date ?? t('attendance.notHeld')}${mark.mark ? ` — ${t(`attendance.${mark.mark}.long` as const)}` : ''}`} arrow>
      <Box
        sx={(theme) => {
          const base = tone === 'text' ? theme.palette.text.secondary : theme.palette[tone].main
          return {
            display: 'inline-grid',
            placeItems: 'center',
            minWidth: 28,
            height: 28,
            px: 0.5,
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 700,
            color: base,
            bgcolor: alpha(base, tone === 'text' ? 0.08 : 0.16),
          }
        }}
      >
        {label}
      </Box>
    </Tooltip>
  )
}
