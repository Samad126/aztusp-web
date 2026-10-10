import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ApiError, apiDelete, apiGet, apiPost, apiPut } from '../api/client.ts'
import { endpoints } from '../api/endpoints.ts'
import type { Subscription, TelegramLink, TelegramStatus } from '../api/types.ts'
import { fieldLabel } from '../i18n/index.ts'
import { Async } from './PageState.tsx'

// The same fields the grade watcher can watch, and its default (`WATCHABLE_FIELDS` in the backend).
const WATCHABLE_FIELDS = ['course_type', 'credits', 'final_score', 'grade', 'retake']
const DEFAULT_FIELDS = ['final_score', 'grade']

interface Loaded {
  subscription: Subscription | null
  telegramLinked: boolean
}

// The API answers 404 while change notifications are off.
function fetchSubscription() {
  return apiGet<Subscription>(endpoints.notifications).catch((caught: unknown) => {
    if (caught instanceof ApiError && caught.status === 404) return null
    throw caught
  })
}

export default function Subscriptions() {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(
    () =>
      Promise.all([fetchSubscription(), apiGet<TelegramStatus>(endpoints.telegram)]).then(
        ([subscription, telegram]) => {
          setLoaded({ subscription, telegramLinked: telegram.linked })
          setError(null)
        },
        (caught: unknown) => setError(caught instanceof Error ? caught : new Error(String(caught))),
      ),
    [],
  )

  useEffect(() => {
    void load()
  }, [load])

  return (
    <Paper elevation={0} sx={{ maxWidth: 720, px: 3, py: 2.5, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t('subscriptions.title')}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
        {t('subscriptions.description')}
      </Typography>
      <Box sx={{ mt: 2.5 }}>
        <Async loading={!loaded && !error} error={error ?? undefined} onRetry={load} rows={3}>
          {loaded && (
            <>
              <TelegramRow linked={loaded.telegramLinked} onChanged={load} />
              <Divider sx={{ my: 2.5 }} />
              <SubscriptionForm
                current={loaded.subscription}
                telegramLinked={loaded.telegramLinked}
                onChanged={load}
              />
            </>
          )}
        </Async>
      </Box>
    </Paper>
  )
}

function TelegramRow({ linked, onChanged }: { linked: boolean; onChanged: () => void }) {
  const { t } = useTranslation()
  const [waiting, setWaiting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Set only when the browser blocked the tab, so the user can tap the link instead.
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const awaiting = waiting && !linked

  useEffect(() => {
    if (!awaiting) return
    // Pressing Start happens in Telegram, so check again when the user comes back to this page.
    window.addEventListener('focus', onChanged)
    return () => window.removeEventListener('focus', onChanged)
  }, [awaiting, onChanged])

  const handleConnect = async () => {
    setBusy(true)
    setError(null)
    setFallbackUrl(null)
    // Safari only opens a window during the click itself, not after the request below, so open the tab now.
    const tab = window.open('', '_blank')
    if (tab) tab.opener = null
    try {
      const link = await apiPost<TelegramLink>(endpoints.telegramLink)
      if (tab) tab.location.href = link.url
      else setFallbackUrl(link.url)
      setWaiting(true)
    } catch (caught) {
      tab?.close()
      setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(false)
    }
  }

  const handleDisconnect = async () => {
    setBusy(true)
    setError(null)
    try {
      await apiDelete(endpoints.telegram)
      setWaiting(false)
      setFallbackUrl(null)
      onChanged()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(false)
    }
  }

  const description = linked
    ? t('subscriptions.telegramConnected')
    : awaiting
      ? t('subscriptions.telegramWaiting')
      : t('subscriptions.telegramHint')

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontWeight: 500 }}>{t('subscriptions.telegram')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
        {linked ? (
          <Button variant="outlined" color="error" disabled={busy} onClick={handleDisconnect}>
            {t('subscriptions.disconnect')}
          </Button>
        ) : fallbackUrl ? (
          <Button variant="outlined" component="a" href={fallbackUrl} target="_blank" rel="noopener noreferrer">
            {t('subscriptions.openTelegram')}
          </Button>
        ) : (
          <Button variant="outlined" disabled={busy} onClick={handleConnect}>
            {t('subscriptions.connect')}
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}

function SubscriptionForm({
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
  const [fields, setFields] = useState<string[]>(current?.fields ?? DEFAULT_FIELDS)
  const [busy, setBusy] = useState<'save' | 'off' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const hasContact = email.trim() !== '' || telegramLinked
  const canSave = busy === null && fields.length > 0 && hasContact

  const toggleField = (name: string, checked: boolean) =>
    setFields(WATCHABLE_FIELDS.filter((item) => (item === name ? checked : fields.includes(item))))

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
      () => apiPut(endpoints.notifications, { email: email.trim() || null, fields }, { keepSession: true }),
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
        {current && current.status === 'ok' && (
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

        <FormControl component="fieldset" error={fields.length === 0}>
          <FormLabel component="legend">{t('subscriptions.fields')}</FormLabel>
          <FormGroup row>
            {WATCHABLE_FIELDS.map((name) => (
              <FormControlLabel
                key={name}
                label={fieldLabel(name)}
                control={
                  <Checkbox
                    checked={fields.includes(name)}
                    disabled={busy !== null}
                    onChange={(_, checked) => toggleField(name, checked)}
                  />
                }
              />
            ))}
          </FormGroup>
          {fields.length === 0 && <FormHelperText>{t('subscriptions.fieldsRequired')}</FormHelperText>}
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
