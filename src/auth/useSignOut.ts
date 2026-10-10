import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext.ts'

/** Signs out and goes to the sign-in page. `signingOut` stays true while the request runs, so buttons can show a spinner. */
export function useSignOut() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const signOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return { signingOut, signOut }
}
