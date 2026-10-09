import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiPost, session } from '../api/client.ts'
import { endpoints } from '../api/endpoints.ts'
import { clearApiCache } from '../api/useApi.ts'
import { AuthContext } from './AuthContext.ts'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState(() => (session.token ? session.username : null))

  useEffect(() => {
    // The API answers 401 once the portal session expires: drop back to the sign-in page.
    session.onUnauthorized(() => {
      clearApiCache()
      setUsername(null)
    })
    return () => session.onUnauthorized(null)
  }, [])

  const login = useCallback(async (user: string, password: string) => {
    const { token } = await apiPost<{ token: string }>(endpoints.login, { username: user, password })
    clearApiCache()
    session.set(token, user)
    setUsername(user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiPost(endpoints.logout)
    } catch {
      // The token may already be invalid; signing out locally is what matters.
    }
    session.clear()
    clearApiCache()
    setUsername(null)
  }, [])

  const value = useMemo(() => ({ username, login, logout }), [username, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
