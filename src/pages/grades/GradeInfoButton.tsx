import { useState } from 'react'
import { Divider, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import { LETTER_SCALE } from '../../lib/grades.ts'
import LetterChip from './LetterChip.tsx'

const SCHOLARSHIPS = [
  { key: 'excellent', rule: 'grades.excellentRule' },
  { key: 'incentive', rule: 'grades.incentiveRule' },
  { key: 'regular', rule: 'grades.regularRule' },
] as const

/** An info button that opens a popover with the letter scale and the scholarship categories. Same pattern as the attendance status info. */
export default function GradeInfoButton() {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      <Tooltip title={t('grades.scaleInfo')}>
        <IconButton
          size="small"
          color="primary"
          aria-label={t('grades.scaleInfo')}
          onClick={(event) => {
            event.stopPropagation()
            setAnchor(event.currentTarget)
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        open={anchor !== null}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack spacing={1.5} sx={{ p: 2.5, maxWidth: 380 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t('grades.scaleTitle')}
          </Typography>
          {LETTER_SCALE.map(({ letter, min, max }) => (
            <Stack key={letter} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <LetterChip letter={letter} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {min}–{max} · {t(`grades.letter${letter}`)}
              </Typography>
            </Stack>
          ))}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <LetterChip letter="F" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('grades.letterF')}
            </Typography>
          </Stack>
          <Divider />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t('grades.scholarshipTitle')}
          </Typography>
          {SCHOLARSHIPS.map(({ key, rule }) => (
            <Typography key={key} variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>{t(`grades.${key}`)}</strong> – {t(rule)}
            </Typography>
          ))}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('grades.scaleNote')}
          </Typography>
        </Stack>
      </Popover>
    </>
  )
}
