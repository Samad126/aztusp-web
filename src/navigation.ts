import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

import type { MessageKey } from './i18n/messages.ts'

export const navItems: { labelKey: MessageKey; path: string; icon: typeof DashboardOutlinedIcon }[] = [
  { labelKey: 'nav.home', path: '/', icon: DashboardOutlinedIcon },
  { labelKey: 'nav.courses', path: '/courses', icon: MenuBookOutlinedIcon },
  { labelKey: 'nav.schedule', path: '/schedule', icon: CalendarMonthOutlinedIcon },
  { labelKey: 'nav.grades', path: '/grades', icon: StarBorderOutlinedIcon },
  { labelKey: 'nav.attendance', path: '/attendance', icon: EditOutlinedIcon },
  { labelKey: 'nav.notices', path: '/notices', icon: AnnouncementOutlinedIcon },
  { labelKey: 'nav.settings', path: '/settings', icon: SettingsOutlinedIcon },
]

export function findNavItem(pathname: string) {
  return navItems.find((item) => (item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)))
}
