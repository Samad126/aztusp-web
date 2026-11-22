import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

/** One line of the settings list: its title and description, and the control beside them. A footnote goes under the whole row. */
export default function SettingRow({
  title,
  description,
  control,
  footnote,
}: {
  title: string
  description: string
  control: ReactNode
  footnote?: string
}) {
  // On phones the control goes under the text, so the text has the full width instead of a narrow column.
  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 1.5, sm: 2 },
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
      {footnote && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          {footnote}
        </Typography>
      )}
    </Box>
  )
}
