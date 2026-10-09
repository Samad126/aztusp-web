import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material'
import AuthLayout from '../layouts/AuthLayout.tsx'
import PasswordField from '../components/PasswordField.tsx'
import { useAuth } from '../auth/AuthContext.ts'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const navigate = useNavigate()
  const { username: signedIn, login } = useAuth()
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (signedIn) return <Navigate to="/" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSubmitting(true)
    setError(null)
    try {
      await login(String(form.get('username')).trim(), String(form.get('password')))
      navigate('/', { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.signIn'))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={t('login.footer')}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            name="username"
            label={t('login.username')}
            placeholder="M0000000000"
            autoComplete="username"
            required
            fullWidth
            autoFocus
            disabled={submitting}
          />
          <PasswordField
            name="password"
            label={t('login.password')}
            autoComplete="current-password"
            required
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {submitting ? t('login.submitting') : t('login.submit')}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
