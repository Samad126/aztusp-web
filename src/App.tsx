import { Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ColorModeProvider } from './theme/ColorModeProvider.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import HomePage from './pages/HomePage.tsx'
import NotificationsPage from './pages/NotificationsPage.tsx'
import AttendancePage from './pages/AttendancePage.tsx'
import GradesPage from './pages/GradesPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

function App() {
  return (
    <ColorModeProvider>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ColorModeProvider>
  )
}

export default App
