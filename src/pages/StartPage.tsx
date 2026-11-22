import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { fetchCached } from '../api/useApi.ts'
import { endpoints } from '../api/endpoints.ts'
import type { Preferences, StartPage } from '../api/types.ts'
import { useAuth } from '../auth/AuthContext.ts'
import { readStartPage, writeStartPage } from '../lib/startPage.ts'
import { startPages } from '../navigation.ts'
import HomePage from './HomePage.tsx'

// The redirect happens once per sign-in of a page load, so the Home link in the sidebar still goes to Home.
let handledFor: string | null = null

/** The page at "/". On the first visit of a session it sends the student to the start page they chose in settings. */
export default function StartRedirect() {
  const { username, demo } = useAuth()
  // Decided once per visit of this page: handledFor changes while the request below runs.
  const [pending] = useState(() => username !== null && handledFor !== username)
  const [copy] = useState(() => (pending && username ? readStartPage(username) : null))
  const [page, setPage] = useState<StartPage | null>(copy)
  // Without a saved copy (a new device) the page waits for the server's answer before showing anything.
  const [waiting, setWaiting] = useState(pending && copy === null && !demo)

  useEffect(() => {
    if (!pending || !username) return
    // Demo sessions have no server to ask; their choice only lives in this browser.
    if (demo) {
      handledFor = username
      return
    }
    let cancelled = false
    fetchCached<Preferences>(endpoints.preferences, true)
      .then(({ start_page }) => {
        writeStartPage(username, start_page)
        // Only a visit without a saved copy follows the answer: with a copy the student is already where it sent them.
        if (!cancelled && copy === null) setPage(start_page)
      })
      .catch(() => {})
      .finally(() => {
        handledFor = username
        if (!cancelled) setWaiting(false)
      })
    return () => {
      cancelled = true
    }
  }, [pending, username, demo, copy])

  if (waiting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }
  const target = pending ? startPages.find((item) => item.value === page) : undefined
  if (target && target.path !== '/') return <Navigate to={target.path} replace />
  return <HomePage />
}
