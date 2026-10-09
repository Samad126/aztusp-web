import { createContext, useContext } from 'react'

export type ColorMode = 'light' | 'dark'

interface ColorModeValue {
  mode: ColorMode
  toggleColorMode: () => void
}

export const ColorModeContext = createContext<ColorModeValue>({
  mode: 'dark',
  toggleColorMode: () => {},
})

export function useColorMode() {
  return useContext(ColorModeContext)
}
