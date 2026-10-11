import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

/** One line of the settings list: its title and description, and the control beside them. */
export default function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: ReactNode
}) {
  // On phones the control goes under the text, so the text has the full width instead of a narrow column.
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1.5, sm: 2 },
        py: 2,
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>
      {control}
    </Box>
  )
}
