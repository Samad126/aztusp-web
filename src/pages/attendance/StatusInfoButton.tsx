import { useState } from 'react'
import { IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import AbsenceStatusChip from './AbsenceStatusChip.tsx'

const STATUSES = [
  { status: 'allGood', hint: 'absence.allGoodHint' },
  { status: 'inLimit', hint: 'absence.inLimitHint' },
  { status: 'fail', hint: 'absence.failHint' },
] as const

/**
 * An info button that opens a popover explaining the absence statuses. It sits in the table rows, which open the
 * course when clicked, so its clicks and the popover's stay put.
 */
export default function StatusInfoButton() {
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      <Tooltip title={t('absence.statusInfo')}>
        <IconButton
          size="small"
          color="primary"
          aria-label={t('absence.statusInfo')}
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
        <Stack spacing={2} sx={{ p: 2.5, maxWidth: 360 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {t('absence.statusTitle')}
          </Typography>
          {STATUSES.map(({ status, hint }) => (
            <Stack key={status} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <AbsenceStatusChip status={status} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t(hint)}
              </Typography>
            </Stack>
          ))}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('absence.limitRule')}
          </Typography>
        </Stack>
      </Popover>
    </>
  )
}
