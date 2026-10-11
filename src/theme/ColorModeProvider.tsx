import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { readStorage, writeStorage } from '../lib/storage.ts'
import { ColorModeContext, type ColorMode } from './ColorModeContext.ts'
import { createAppTheme } from './createAppTheme.ts'

const STORAGE_KEY = 'userhelper-color-mode'

function getInitialMode(): ColorMode {
  const saved = readStorage(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  // Nothing saved, or storage is blocked: follow the system setting.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState(getInitialMode)

  useEffect(() => {
    writeStorage(STORAGE_KEY, mode)
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
