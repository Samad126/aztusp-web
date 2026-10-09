import type { ElementType } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface StatCardProps {
  icon: ElementType
  label: string
  value: string | number
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
}

export default function StatCard({ icon: Icon, label, value, tone = 'primary' }: StatCardProps) {
  return (
    <Paper elevation={0} sx={{ width: 180, px: 2, py: 2.5, textAlign: 'center' }}>
      <Box
        sx={{
          width: 72,
          height: 72,
          mx: 'auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          color: `${tone}.main`,
          bgcolor: (theme) => alpha(theme.palette[tone].main, 0.2),
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Box>
      <Typography noWrap sx={{ mt: 2 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
    </Paper>
  )
}
