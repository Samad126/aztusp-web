import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountMenu from '../components/AccountMenu.tsx'
import Sidebar from '../components/Sidebar.tsx'
import ThemeToggle from '../components/ThemeToggle.tsx'
import { findNavItem } from '../navigation.ts'
import { useAuth } from '../auth/AuthContext.ts'
import { useTranslation } from 'react-i18next'
import { DRAWER_WIDTH, HEADER_HEIGHT, MOBILE_DRAWER_WIDTH } from './constants.ts'

const drawerPaperSx = {
  '& .MuiDrawer-paper': {
    width: { xs: MOBILE_DRAWER_WIDTH, md: DRAWER_WIDTH },
    maxWidth: '100vw',
    boxSizing: 'border-box',
  },
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { pathname, search, hash, state } = useLocation()
  const { username } = useAuth()
  const { t } = useTranslation()
  const currentPage = findNavItem(pathname)

  // The open mobile drawer is marked on its own history entry, so the system back button closes it
  // instead of leaving the page. Closing it from the UI steps back over that entry again.
  const mobileOpen = Boolean(state?.drawer)
  const openDrawer = () => navigate({ pathname, search, hash }, { state: { drawer: true } })
  const closeDrawer = () => {
    if (mobileOpen) navigate(-1)
  }

  if (!username) return <Navigate to="/login" replace />

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Off-canvas drawer on small screens */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeDrawer}
          sx={{ display: { xs: 'block', md: 'none' }, ...drawerPaperSx }}
        >
          <Sidebar inDrawer />
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
              onClick={openDrawer}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
              {currentPage && t(currentPage.labelKey)}
            </Typography>

            <ThemeToggle />
            <AccountMenu />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
