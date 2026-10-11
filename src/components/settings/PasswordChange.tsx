import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { apiPost } from '../../api/client.ts'
import { endpoints } from '../../api/endpoints.ts'
import type { PasswordChangeResult } from '../../api/types.ts'
import PasswordField from '../PasswordField.tsx'
import SettingsSection from './SettingsSection.tsx'

export default function PasswordChange() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const mismatch = confirmPassword !== '' && password !== confirmPassword
  const canSubmit = !busy && password !== '' && confirmPassword !== '' && !mismatch

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const result = await apiPost<PasswordChangeResult>(endpoints.password, {
        password,
        confirm_password: confirmPassword,
      })
      if (result.changed) {
        setPassword('')
        setConfirmPassword('')
        setNotice(t('password.changed'))
      } else {
        // The site explains a rejected change in its own alerts; show those when there are any.
        setError(result.messages.join(' ') || t('password.notChanged'))
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <SettingsSection title={t('password.changeTitle')} description={t('password.changeDescription')}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2.5 }}>
        <Stack spacing={2.5}>
          <PasswordField
            name="password"
            label={t('password.newPassword')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={busy}
          />
          <PasswordField
            name="confirm_password"
            label={t('password.confirmPassword')}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={busy}
            error={mismatch}
            helperText={mismatch ? t('password.mismatch') : undefined}
          />

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('password.notificationsHint')}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {notice && <Alert severity="success">{notice}</Alert>}

          <Box>
            <Button type="submit" variant="contained" disabled={!canSubmit}>
              {t('password.submit')}
            </Button>
          </Box>
        </Stack>
      </Box>
    </SettingsSection>
  )
}
