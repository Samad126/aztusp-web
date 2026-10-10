import { Alert, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSignOut } from '../auth/useSignOut.ts'

/** Shown above every page in demo mode, so the sample data is never mistaken for a real account. */
export default function DemoBanner() {
  const { t } = useTranslation()
  const { signingOut, signOut } = useSignOut()

  return (
    <Alert
      severity="info"
      sx={{ mb: 3 }}
      action={
        <Button color="inherit" size="small" disabled={signingOut} onClick={signOut}>
          {t('demo.exit')}
        </Button>
      }
    >
      {t('demo.banner')}
    </Alert>
  )
}
