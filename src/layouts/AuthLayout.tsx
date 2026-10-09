import type { ReactNode } from 'react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import Logo from '../components/Logo.tsx'
import ThemeToggle from '../components/ThemeToggle.tsx'
import LanguageSwitcher from '../components/LanguageSwitcher.tsx'
import { useTranslation } from 'react-i18next'

export default function AuthLayout({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string
  subtitle: string
  footer: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, p: 2 }}>
        <LanguageSwitcher compact />
        <ThemeToggle />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'grid', placeItems: 'center', px: 2, pb: 6 }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              mb: 4,
              textAlign: 'center',
            }}
          >
            <Logo size={64} />
            <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1.3 }}>
              {t('app.name')}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>

          {children}

          {footer && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {footer}
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}
