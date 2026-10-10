import { useState } from 'react'
import { Avatar, Box, Button, ButtonBase, CircularProgress, Divider, Popover, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTranslation } from 'react-i18next'
import { endpoints } from '../api/endpoints.ts'
import { usePhotoUrl } from '../api/photo.ts'
import { useApi } from '../api/useApi.ts'
import type { ProfilePage } from '../api/types.ts'
import { useAuth } from '../auth/AuthContext.ts'
import { useSignOut } from '../auth/useSignOut.ts'
import { initials, studentName } from '../lib/format.ts'

/** The header avatar. Clicking it opens a panel with the student's full name and a logout button. */
export default function AccountMenu() {
  const { t } = useTranslation()
  const { username } = useAuth()
  const { signingOut, signOut } = useSignOut()
  const profile = useApi<ProfilePage>(endpoints.profile)
  const photo = usePhotoUrl()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const info = profile.data?.pairs.info
  // Until the profile has loaded, the login name stands in for the full name.
  const name = (info && studentName(info)) || username || ''

  return (
    <>
      <ButtonBase
        aria-label={t('account.menu')}
        aria-haspopup="true"
        aria-expanded={Boolean(anchor)}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ borderRadius: '50%' }}
      >
        <Avatar
          alt={username ?? ''}
          src={photo ?? undefined}
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700, fontSize: 16 }}
        >
          {initials(username ?? '')}
        </Avatar>
      </ButtonBase>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 260, maxWidth: 'calc(100vw - 32px)' } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{name}</Typography>
          <Divider sx={{ my: 2 }} />
          <Button
            fullWidth
            variant="outlined"
            color="error"
            disabled={signingOut}
            onClick={signOut}
            startIcon={signingOut ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
          >
            {t('nav.logout')}
          </Button>
        </Box>
      </Popover>
    </>
  )
}
