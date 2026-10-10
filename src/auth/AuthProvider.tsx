import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiPost, DEMO_TOKEN, session } from '../api/client.ts'
import { endpoints } from '../api/endpoints.ts'
import { clearApiCache } from '../api/useApi.ts'
import { DEMO_USERNAME } from '../demo/data.ts'
import { AuthContext } from './AuthContext.ts'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState(() => (session.token ? session.username : null))
  const [demo, setDemo] = useState(() => session.demo)

  useEffect(() => {
    // The API answers 401 once the portal session expires: drop back to the sign-in page.
    session.onUnauthorized(() => {
      clearApiCache()
      setUsername(null)
      setDemo(false)
    })
    return () => session.onUnauthorized(null)
  }, [])

  const login = useCallback(async (user: string, password: string) => {
    const { token } = await apiPost<{ token: string }>(endpoints.login, { username: user, password })
    clearApiCache()
    session.set(token, user)
    setDemo(false)
    setUsername(user)
  }, [])

  // Demo mode needs no login: the session only tells the app to answer from the sample data.
  const startDemo = useCallback(() => {
    clearApiCache()
    session.set(DEMO_TOKEN, DEMO_USERNAME)
    setDemo(true)
    setUsername(DEMO_USERNAME)
  }, [])

  const logout = useCallback(async () => {
    // A demo session has no portal session to end, so nothing is sent.
    if (!session.demo) {
      try {
        await apiPost(endpoints.logout)
      } catch {
        // The token may already be invalid; signing out locally is what matters.
      }
    }
    session.clear()
    clearApiCache()
    setDemo(false)
    setUsername(null)
  }, [])

  const value = useMemo(
    () => ({ username, demo, login, startDemo, logout }),
    [username, demo, login, startDemo, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
