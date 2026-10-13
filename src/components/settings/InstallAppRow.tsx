import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useTranslation } from 'react-i18next'
import { promptInstall, useInstallState } from '../../pwa/installPrompt.ts'
import SettingRow from './SettingRow.tsx'

/** The install button on the settings page. It shows nothing where the app is already installed or can't be installed. */
export default function InstallAppRow() {
  const { t } = useTranslation()
  const state = useInstallState()
  const [iosHelpOpen, setIosHelpOpen] = useState(false)

  if (state === 'installed' || state === 'unsupported') return null

  return (
    <>
      <Divider />
      <SettingRow
        title={t('settings.install')}
        description={t('settings.installHint')}
        control={
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={state === 'ios' ? () => setIosHelpOpen(true) : () => void promptInstall()}
          >
            {t('settings.installButton')}
          </Button>
        }
      />
      {state === 'ios' && (
        <Dialog open={iosHelpOpen} onClose={() => setIosHelpOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('settings.installIosTitle')}</DialogTitle>
          <DialogContent>
            <Typography component="ol" sx={{ m: 0, pl: 2.5, display: 'grid', gap: 1.5 }}>
              <li>{t('settings.installIosStep1')}</li>
              <li>{t('settings.installIosStep2')}</li>
              <li>{t('settings.installIosStep3')}</li>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIosHelpOpen(false)}>{t('common.close')}</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
