import type { ElementType } from 'react'
import type { ListItemButtonProps } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { NavLink, useNavigate } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import LogoutIcon from '@mui/icons-material/Logout'
import Logo from './Logo.tsx'
import { HEADER_HEIGHT } from '../layouts/constants.ts'
import { navItems } from '../navigation.ts'
import { useAuth } from '../auth/AuthContext.ts'
import { useTranslation } from 'react-i18next'
import { version } from '../../package.json'

const SOURCE_CODE_URL = 'https://github.com/Samad126/aztusp-web'

const itemSx = {
  minHeight: 56,
  px: 3,
  '& .MuiListItemText-primary': { fontWeight: 500 },
  '&.active': {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.16),
  },
}

function SidebarItem({
  icon: Icon,
  label,
  ...props
}: {
  icon: ElementType
  label: string
  component?: ElementType
  to?: string
  end?: boolean
  replace?: boolean
  href?: string
  target?: string
  rel?: string
} & ListItemButtonProps) {
  return (
    <ListItemButton sx={itemSx} {...props}>
      <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}

export default function Sidebar({ inDrawer = false }: { inDrawer?: boolean }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

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
        <SidebarItem icon={LogoutIcon} label={t('nav.logout')} onClick={handleLogout} />
      </List>
    </Box>
  )
}
