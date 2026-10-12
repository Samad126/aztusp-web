import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { AbsenceStatus } from '../../lib/attendance.ts'

const TONE = { allGood: 'success', inLimit: 'warning', fail: 'error' } as const
const LABEL = { allGood: 'absence.allGood', inLimit: 'absence.inLimit', fail: 'absence.fail' } as const

/** The student's standing against the absence limit: All good, In limit or Fail. */
export default function AbsenceStatusChip({ status }: { status: AbsenceStatus }) {
  const { t } = useTranslation()
  return <Chip size="small" color={TONE[status]} label={t(LABEL[status])} sx={{ flexShrink: 0 }} />
}
