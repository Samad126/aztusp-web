import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppBar, Avatar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from '../components/Sidebar.tsx'
import ThemeToggle from '../components/ThemeToggle.tsx'
import { findNavItem } from '../navigation.ts'
import { useAuth } from '../auth/AuthContext.ts'
import { useTranslation } from 'react-i18next'
import { initials } from '../lib/format.ts'
import { DRAWER_WIDTH, HEADER_HEIGHT } from './constants.ts'

const drawerPaperSx = {
  '& .MuiDrawer-paper': { width: DRAWER_WIDTH, maxWidth: '100vw', boxSizing: 'border-box' },
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { username } = useAuth()
  const { t } = useTranslation()
  const currentPage = findNavItem(pathname)

  if (!username) return <Navigate to="/login" replace />

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Off-canvas drawer on small screens */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { xs: 'block', md: 'none' }, ...drawerPaperSx }}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        {/* Fixed sidebar on desktop */}
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, ...drawerPaperSx }}>
          <Sidebar />
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ bgcolor: 'background.default' }}
        >
          <Toolbar sx={{ minHeight: HEADER_HEIGHT, gap: 2, px: { xs: 2, md: 3 } }}>
            <IconButton
              edge="start"
              aria-label={t('nav.open')}
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
              {currentPage && t(currentPage.labelKey)}
            </Typography>

            <ThemeToggle />
            <Avatar
              alt={username}
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700, fontSize: 16 }}
            >
              {initials(username)}
            </Avatar>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
