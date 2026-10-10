import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, Divider, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ThemeToggle from '../components/ThemeToggle.tsx'
import Subscriptions from '../components/Subscriptions.tsx'
import { useAuth } from '../auth/AuthContext.ts'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n/messages.ts'

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 2 }}>
      <Box>
        <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>
      {control}
    </Box>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { username, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const [busy, setBusy] = useState(false)

  const handleLogout = async () => {
    setBusy(true)
    await logout()
    navigate('/login')
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ maxWidth: 720, px: 3, py: 1, border: 1, borderColor: 'divider' }}>
        <SettingRow
          title={t('settings.account')}
          description={t('settings.signedIn', { name: username ?? '' })}
          control={
            <Button
              variant="outlined"
              color="error"
              disabled={busy}
              onClick={handleLogout}
              startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
            >
              {t('settings.signOut')}
            </Button>
          }
        />
        <Divider />
        <SettingRow
          title={t('settings.dark')}
          description={t('settings.darkHint')}
          control={<ThemeToggle />}
        />
        <Divider />
        <SettingRow
          title={t('settings.language')}
          description={t('settings.languageHint')}
          control={
            <ToggleButtonGroup
              exclusive
              size="small"
              value={i18n.resolvedLanguage}
              aria-label={t('settings.language')}
              onChange={(_, value: string | null) => {
                if (value) void i18n.changeLanguage(value)
              }}
            >
              {languages.map((item) => (
                <ToggleButton key={item.code} value={item.code} sx={{ px: 2, textTransform: 'none' }}>
                  {item.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          }
        />
      </Paper>
      <Subscriptions />
    </Stack>
  )
}
