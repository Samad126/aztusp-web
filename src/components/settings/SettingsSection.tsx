import type { ReactNode } from 'react'
import { Paper, Typography } from '@mui/material'

/** A card on the settings page: a title and a line of description above its controls. */
export default function SettingsSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Paper elevation={0} sx={{ maxWidth: 720, px: 3, py: 2.5, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
        {description}
      </Typography>
      {children}
    </Paper>
  )
}
