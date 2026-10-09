import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { ColorModeContext, type ColorMode } from './ColorModeContext.ts'
import { createAppTheme } from './createAppTheme.ts'

const STORAGE_KEY = 'userhelper-color-mode'

function getInitialMode(): ColorMode {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be blocked (private mode, disabled site data); fall back to the system setting.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState(getInitialMode)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // The choice just won't survive a reload.
    }
  }, [mode])

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  )

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  )
}
