import { Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ColorModeProvider } from './theme/ColorModeProvider.tsx'
import './i18n/index.ts'
import { AuthProvider } from './auth/AuthProvider.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import CoursesPage from './pages/CoursesPage.tsx'
import CourseDetailPage from './pages/CourseDetailPage.tsx'
import SchedulePage from './pages/SchedulePage.tsx'
import GradesPage from './pages/GradesPage.tsx'
import AttendancePage from './pages/AttendancePage.tsx'
import NoticesPage from './pages/NoticesPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

function App() {
  return (
    <ColorModeProvider>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ColorModeProvider>
  )
}

export default App
