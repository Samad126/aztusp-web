import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AbsenceInput from '../../../components/AbsenceInput.tsx'
import { parseLessons } from '../../../lib/attendance.ts'

/** The lessons-to-miss input for one course. The journal's summary shows what the typed lessons do. Nothing is saved or sent. */
export default function AbsenceSimulation({
  value,
  onChange,
  remaining,
}: {
  value: string
  onChange: (value: string) => void
  remaining: number
}) {
  const { t } = useTranslation()
  const tooMany = parseLessons(value) > remaining

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {t('absence.title')}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {t('absence.description')}
      </Typography>
      <AbsenceInput
        value={value}
        onChange={onChange}
        error={tooMany}
        helperText={tooMany ? t('absence.tooMany', { remaining }) : t('absence.remaining', { remaining })}
      />
    </Box>
  )
}
