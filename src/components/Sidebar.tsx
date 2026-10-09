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
import { version } from '../../package.json'

// Placeholder: point this at your repository.
const SOURCE_CODE_URL = 'https://github.com'

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

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onNavigate?.()
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
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Logo />
        <Typography variant="h6" noWrap sx={{ fontWeight: 500 }}>
          UserHelper
        </Typography>
      </Box>

      <List component="nav" sx={{ py: 2 }}>
        {navItems.map((item) => (
          <SidebarItem
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            icon={item.icon}
            label={item.label}
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
          label="Source code"
        />
        <SidebarItem icon={LogoutIcon} label="Logout" onClick={handleLogout} />
      </List>
    </Box>
  )
}
