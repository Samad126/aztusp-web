import { Box, List, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LogoutIcon from '@mui/icons-material/Logout'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { version } from '../../package.json'
import { useSignOut } from '../auth/useSignOut.ts'
import { HEADER_HEIGHT } from '../layouts/constants.ts'
import { navItems } from '../navigation.ts'
import Logo from './Logo.tsx'
import SidebarItem from './SidebarItem.tsx'

const SOURCE_CODE_URL = 'https://github.com/Samad126/aztusp-web'

export default function Sidebar({ inDrawer = false }: { inDrawer?: boolean }) {
  const { signingOut, signOut } = useSignOut()
  const { t } = useTranslation()

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          height: HEADER_HEIGHT,
        }}
      >
        <Logo />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.25, whiteSpace: { xs: 'normal', md: 'nowrap' } }}>
          {t('app.name')}
        </Typography>
      </Box>

      <List component="nav" sx={{ py: 2 }}>
        {navItems.map((item) => (
          <SidebarItem
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === '/'}
            // Inside the drawer, replace its history entry so Back doesn't reopen it
            replace={inDrawer || undefined}
            icon={item.icon}
            label={t(item.labelKey)}
          />
        ))}
      </List>

      <Typography
        variant="body2"
        sx={{ mt: 'auto', px: 3, py: 2, fontFamily: 'monospace', color: 'text.secondary' }}
      >
        v{version}
      </Typography>

      <List sx={{ pb: 2 }}>
        <SidebarItem
          component="a"
          href={SOURCE_CODE_URL}
          target="_blank"
          rel="noreferrer"
          icon={GitHubIcon}
          label={t('nav.source')}
        />
        <SidebarItem
          icon={LogoutIcon}
          label={t('nav.logout')}
          busy={signingOut}
          disabled={signingOut}
          onClick={signOut}
        />
      </List>
    </Box>
  )
}
