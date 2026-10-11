import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'

/** A lesson the API gave only as text, shown as it was written. */
export default function TextCard({ text }: { text: string }) {
  return (
    <Box
      sx={(theme) => ({
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        borderLeft: 3,
        borderLeftColor: 'primary.main',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
        color: 'text.primary',
        fontSize: 12.5,
        lineHeight: 1.45,
        whiteSpace: 'pre-line',
        overflowWrap: 'anywhere',
      })}
    >
      {text}
    </Box>
  )
}
