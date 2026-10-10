import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AuthLayout from '../layouts/AuthLayout.tsx'
import PasswordField from '../components/PasswordField.tsx'
import { useAuth } from '../auth/AuthContext.ts'
import { DEMO_USERNAME } from '../demo/data.ts'
import { useTranslation } from 'react-i18next'

type Mode = 'live' | 'demo'

export default function LoginPage() {
  const navigate = useNavigate()
  const { username: signedIn, login, startDemo } = useAuth()
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>('live')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const demo = mode === 'demo'

  if (signedIn) return <Navigate to="/" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (demo) {
      startDemo()
      navigate('/', { replace: true })
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await login(username.trim(), password)
      navigate('/', { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.signIn'))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={t('login.title')}
      subtitle={demo ? t('login.subtitleDemo') : t('login.subtitle')}
      footer={demo ? t('login.demoFooter') : t('login.footer')}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={mode}
            aria-label={t('login.mode')}
            onChange={(_, value: Mode | null) => {
              if (!value) return
              setMode(value)
              setError(null)
              // A password typed in live mode is not left in the locked demo field.
              if (value === 'demo') setPassword('')
            }}
          >
            <ToggleButton value="live" sx={{ textTransform: 'none' }}>
              {t('login.modeLive')}
            </ToggleButton>
            <ToggleButton value="demo" sx={{ textTransform: 'none' }}>
              {t('login.modeDemo')}
            </ToggleButton>
          </ToggleButtonGroup>

          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            name="username"
            label={t('login.username')}
            // Demo mode shows the sample name, read-only, so nothing has to be typed in.
            value={demo ? DEMO_USERNAME : username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="M0000000000"
            autoComplete="username"
            required={!demo}
            fullWidth
            autoFocus={!demo}
            disabled={demo || submitting}
          />
          <PasswordField
            name="password"
            label={t('login.password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required={!demo}
            disabled={demo || submitting}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {demo ? t('login.demoSubmit') : submitting ? t('login.submitting') : t('login.submit')}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
