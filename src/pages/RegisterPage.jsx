import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, Link, Stack, TextField } from '@mui/material'
import AuthLayout from '../layouts/AuthLayout.jsx'
import PasswordField from '../components/PasswordField.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const passwordsMismatch = form.confirmPassword !== '' && form.confirmPassword !== form.password

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Placeholder: replace with a real sign-up request.
    navigate('/')
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your UserHelper account"
      footer={
        <>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            name="name"
            label="Full name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <PasswordField
            name="password"
            label="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={passwordsMismatch}
            helperText={passwordsMismatch ? 'Passwords do not match' : ' '}
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={passwordsMismatch}>
            Create account
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
