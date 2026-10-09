import { Box, Divider, Paper, Typography } from '@mui/material'
import Logo from '../components/Logo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
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
            <Logo />
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
