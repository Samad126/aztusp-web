import { Switch } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useTranslation } from 'react-i18next'
import { useColorMode } from '../theme/ColorModeContext.ts'

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode()
  const { t } = useTranslation()
  const isDark = mode === 'dark'
  const ThemeIcon = isDark ? DarkModeIcon : LightModeIcon

  return (
    <Switch
      checked={isDark}
      onChange={toggleColorMode}
      slotProps={{
        input: { 'aria-label': t('settings.dark') },
        thumb: {
          sx: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
          children: <ThemeIcon sx={{ fontSize: 14, color: 'common.black' }} />,
        },
      }}
    />
  )
}
