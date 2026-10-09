import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppBar, Avatar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from '../components/Sidebar.tsx'
import ThemeToggle from '../components/ThemeToggle.tsx'
import { navItems } from '../navigation.ts'
import { DRAWER_WIDTH, HEADER_HEIGHT } from './constants.ts'

const drawerPaperSx = {
  '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const currentPage = navItems.find((item) => item.path === pathname)

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
          sx={{ bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}
        >
          <Toolbar sx={{ minHeight: HEADER_HEIGHT, gap: 2, px: { xs: 2, md: 3 } }}>
            <IconButton
              edge="start"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
              {currentPage?.label}
            </Typography>

            <ThemeToggle />
            <Avatar alt="User" />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
