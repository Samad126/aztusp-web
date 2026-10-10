import type { ReactNode } from 'react'
import { Box, Button, CircularProgress, Divider, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ThemeToggle from '../components/ThemeToggle.tsx'
import Subscriptions from '../components/Subscriptions.tsx'
import PasswordChange from '../components/PasswordChange.tsx'
import ProfilePhoto from '../components/ProfilePhoto.tsx'
import { useAuth } from '../auth/AuthContext.ts'
import { useSignOut } from '../auth/useSignOut.ts'
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
  // On phones the control goes under the text, so the text has the full width instead of a narrow column.
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1.5, sm: 2 },
        py: 2,
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
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
  const { username } = useAuth()
  const { t, i18n } = useTranslation()
  const { signingOut, signOut } = useSignOut()

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
              disabled={signingOut}
              onClick={signOut}
              startIcon={signingOut ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
            >
              {t('settings.signOut')}
            </Button>
          }
        />
        <Divider />
        <SettingRow
          title={t('settings.dark')}
          description={t('settings.darkHint')}
          // The switch has built-in padding; on phones the negative margin lines its track up with the text.
          control={
            <Box sx={{ ml: { xs: -1.5, sm: 0 } }}>
              <ThemeToggle />
            </Box>
          }
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
      <ProfilePhoto />
      <PasswordChange />
      <Subscriptions />
    </Stack>
  )
}
