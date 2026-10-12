import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface AbsenceInputProps {
  value: string
  onChange: (value: string) => void
  helperText?: string
  error?: boolean
}

/** The lesson count for the absence simulator. Whole numbers only; the parent reads it with `parseLessons`. */
export default function AbsenceInput({ value, onChange, helperText, error = false }: AbsenceInputProps) {
  const { t } = useTranslation()
  return (
    <TextField
      type="number"
      size="small"
      label={t('absence.label')}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      helperText={helperText}
      error={error}
      slotProps={{ htmlInput: { min: 0, step: 1, inputMode: 'numeric' } }}
      sx={{
        width: 220,
        // Hides the spin arrows: WebKit and Blink use the first selector, Firefox the second.
        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '& input[type=number]': { MozAppearance: 'textfield', appearance: 'textfield' },
      }}
    />
  )
}
