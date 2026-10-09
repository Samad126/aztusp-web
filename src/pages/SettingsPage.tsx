import { useState, type ReactNode } from 'react'
import { Box, Divider, Paper, Switch, Typography } from '@mui/material'
import ThemeToggle from '../components/ThemeToggle.tsx'

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 2 }}>
      <Box>
        <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>
      {control}
    </Box>
  )
}

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <Paper elevation={0} sx={{ maxWidth: 720, px: 3, py: 1 }}>
      <SettingRow
        title="Dark mode"
        description="Switch between the dark and light theme."
        control={<ThemeToggle />}
      />
      <Divider />
      <SettingRow
        title="Email notifications"
        description="Receive important updates by email."
        control={
          <Switch
            checked={emailNotifications}
            onChange={(event) => setEmailNotifications(event.target.checked)}
            slotProps={{ input: { 'aria-label': 'Email notifications' } }}
          />
        }
      />
    </Paper>
  )
}
