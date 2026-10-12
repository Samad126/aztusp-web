import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface AbsenceInputProps {
  value: string
  onChange: (value: string) => void
  helperText?: string
  error?: boolean
}

/** The lesson count for the absence simulator. Digits only; the parent reads it with `parseLessons`. */
export default function AbsenceInput({ value, onChange, helperText, error = false }: AbsenceInputProps) {
  const { t } = useTranslation()
  // Keeps digits only, so letters, signs, decimal points and pasted text never reach the parent.
  return (
    <TextField
      size="small"
      label={t('absence.label')}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
      helperText={helperText}
      error={error}
      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
      sx={{ width: 220 }}
    />
  )
}
