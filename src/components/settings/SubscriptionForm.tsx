import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ApiError, apiDelete, apiPut } from '../../api/client.ts'
import { endpoints } from '../../api/endpoints.ts'
import type { Subscription } from '../../api/types.ts'

export default function SubscriptionForm({
  current,
  telegramLinked,
  onChanged,
}: {
  current: Subscription | null
  telegramLinked: boolean
  onChanged: () => void
}) {
  const { t, i18n } = useTranslation()
  // Filled in once, from the saved settings. No password is asked for: the one saved at sign-in is used.
  const [email, setEmail] = useState(current?.email ?? '')
  const [grades, setGrades] = useState(current?.grades ?? true)
  const [attendance, setAttendance] = useState(current?.attendance ?? false)
  const [busy, setBusy] = useState<'save' | 'off' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Like the backend, something has to be watched. Either option is enough.
  const watching = grades || attendance
  const hasContact = email.trim() !== '' || telegramLinked
  const canSave = busy === null && watching && hasContact

  const option = (label: string, checked: boolean, onChange: (checked: boolean) => void) => (
    <FormControlLabel
      key={label}
      label={label}
      control={<Checkbox checked={checked} disabled={busy !== null} onChange={(_, value) => onChange(value)} />}
    />
  )

  const run = async (action: 'save' | 'off', request: () => Promise<unknown>, done: string) => {
    setBusy(action)
    setError(null)
    setNotice(null)
    try {
      await request()
      setNotice(done)
      onChanged()
    } catch (caught) {
      // A 401 on save: the sign-in has ended (token expired) or the site rejected the saved password. The session is
      // kept so the message can say what to do (see `send`).
      const rejected = action === 'save' && caught instanceof ApiError && caught.status === 401
      setError(rejected ? t('subscriptions.relogin') : caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(null)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void run(
      'save',
      () =>
        apiPut(
          endpoints.notifications,
          {
            email: email.trim() || null,
            grades,
            attendance,
          },
          { keepSession: true },
        ),
      t('subscriptions.saved'),
    )
  }

  const lastChecked = current?.last_checked_at
    ? new Date(current.last_checked_at).toLocaleString(i18n.resolvedLanguage, { dateStyle: 'medium', timeStyle: 'short' })
    : null

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        {current?.status === 'wrong_password' && <Alert severity="warning">{t('subscriptions.wrongPassword')}</Alert>}
        {current?.status === 'error' && <Alert severity="warning">{t('subscriptions.checkFailed')}</Alert>}
        {current && (current.status === 'ok' || lastChecked) && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {lastChecked ? t('subscriptions.lastChecked', { time: lastChecked }) : t('subscriptions.notChecked')}
          </Typography>
        )}

        <TextField
          type="email"
          name="email"
          label={t('subscriptions.email')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          helperText={telegramLinked ? t('subscriptions.emailOptional') : t('subscriptions.emailRequired')}
          autoComplete="email"
          fullWidth
          disabled={busy !== null}
        />

        <FormControl component="fieldset" error={!watching}>
          <FormLabel component="legend">{t('subscriptions.fields')}</FormLabel>
          <FormGroup row>
            {option(t('subscriptions.grades'), grades, setGrades)}
            {option(t('subscriptions.attendance'), attendance, setAttendance)}
          </FormGroup>
          {!watching && <FormHelperText>{t('subscriptions.fieldsRequired')}</FormHelperText>}
        </FormControl>

        {error && <Alert severity="error">{error}</Alert>}
        {notice && <Alert severity="success">{notice}</Alert>}

        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          <Button type="submit" variant="contained" disabled={!canSave}>
            {current ? t('subscriptions.save') : t('subscriptions.turnOn')}
          </Button>
          {current && (
            <Button
              variant="outlined"
              color="error"
              disabled={busy !== null}
              onClick={() => void run('off', () => apiDelete(endpoints.notifications), t('subscriptions.turnedOff'))}
            >
              {t('subscriptions.turnOff')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
