import { alpha, createTheme } from '@mui/material/styles'

// Surfaces and accent follow the reference dashboard: near-black panels with a mint accent in dark mode.
const palettes = {
  dark: {
    primary: '#1de9b6',
    background: { default: '#111315', paper: '#1a1d21' },
    divider: '#2b3036',
    text: { primary: '#f0f2f4', secondary: '#9ba4ae' },
  },
  light: {
    primary: '#00897b',
    background: { default: '#f3f5f7', paper: '#ffffff' },
    divider: '#e2e6ea',
    text: { primary: '#1c2126', secondary: '#5d6873' },
  },
}

export function createAppTheme(mode: 'light' | 'dark') {
  const palette = palettes[mode]
  const headTint = alpha(palette.primary, mode === 'dark' ? 0.08 : 0.06)

  return createTheme({
    palette: {
      mode,
      primary: { main: palette.primary },
      background: palette.background,
      divider: palette.divider,
      text: palette.text,
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: { root: { textTransform: 'none' } },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: palette.divider, paddingBlock: 12 },
          head: {
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: palette.text.secondary,
            // The tint is laid over the paper colour, not used alone: a translucent header lets the rows scrolling
            // under it (and under a sticky column) show through.
            backgroundColor: palette.background.paper,
            backgroundImage: `linear-gradient(${headTint}, ${headTint})`,
            whiteSpace: 'nowrap',
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 500 } },
      },
    },
  })
}
