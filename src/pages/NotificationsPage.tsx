import { Avatar, Box, Paper, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

const notifications = [
  {
    id: 1,
    title: 'Welcome to UserHelper',
    body: 'Your account is ready. Explore the dashboard and adjust your settings at any time.',
  },
  {
    id: 2,
    title: 'Scheduled maintenance',
    body: 'The service will be unavailable on Saturday from 02:00 to 04:00.',
  },
  {
    id: 3,
    title: 'New message from support',
    body: 'Our team replied to your request. Open the message to read the full response.',
  },
  {
    id: 4,
    title: 'Complete your profile',
    body: 'Add your details so the dashboard can show personalized information.',
  },
]

export default function NotificationsPage() {
  return (
    <Stack spacing={2}>
      {notifications.map((item) => (
        <Paper key={item.id} elevation={0} sx={{ display: 'flex', gap: 2, p: 2.5 }}>
          <Avatar sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2), color: 'primary.main' }}>
            <NotificationsNoneOutlinedIcon />
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {item.body}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  )
}
