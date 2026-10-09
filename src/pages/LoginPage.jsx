import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, Link, Stack, TextField } from '@mui/material'
import AuthLayout from '../layouts/AuthLayout.jsx'
import PasswordField from '../components/PasswordField.jsx'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    // Placeholder: replace with a real sign-in request.
    navigate('/')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to UserHelper"
      footer={
        <>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            Create one
          </Link>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField name="email" label="Email" type="email" autoComplete="email" required fullWidth />
          <PasswordField name="password" label="Password" autoComplete="current-password" required />
          <Button type="submit" variant="contained" size="large" fullWidth>
            Sign in
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
