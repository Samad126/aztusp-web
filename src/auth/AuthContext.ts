import { createContext, useContext } from 'react'

export interface AuthState {
  username: string | null
  /** True for the sample-data session, which has no portal account behind it. */
  demo: boolean
  login: (username: string, password: string) => Promise<void>
  startDemo: () => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
