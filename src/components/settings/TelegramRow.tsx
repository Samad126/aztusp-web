import { useEffect, useState } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { apiDelete, apiPost } from '../../api/client.ts'
import { endpoints } from '../../api/endpoints.ts'
import type { TelegramLink } from '../../api/types.ts'

export default function TelegramRow({ linked, onChanged }: { linked: boolean; onChanged: () => void }) {
  const { t } = useTranslation()
  const [waiting, setWaiting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Set only when the browser blocked the tab, so the user can tap the link instead.
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const awaiting = waiting && !linked

  useEffect(() => {
    if (!awaiting) return
    // Pressing Start happens in Telegram, so check again when the user comes back to this page.
    window.addEventListener('focus', onChanged)
    return () => window.removeEventListener('focus', onChanged)
  }, [awaiting, onChanged])

  const handleConnect = async () => {
    setBusy(true)
    setError(null)
    setFallbackUrl(null)
    // Safari only opens a window during the click itself, not after the request below, so open the tab now.
    const tab = window.open('', '_blank')
    if (tab) tab.opener = null
    try {
      const link = await apiPost<TelegramLink>(endpoints.telegramLink)
      if (tab) tab.location.href = link.url
      else setFallbackUrl(link.url)
      setWaiting(true)
    } catch (caught) {
      tab?.close()
      setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(false)
    }
  }

  const handleDisconnect = async () => {
    setBusy(true)
    setError(null)
    try {
      await apiDelete(endpoints.telegram)
      setWaiting(false)
      setFallbackUrl(null)
      onChanged()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(false)
    }
  }

  const description = linked
    ? t('subscriptions.telegramConnected')
    : awaiting
      ? t('subscriptions.telegramWaiting')
      : t('subscriptions.telegramHint')

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontWeight: 500 }}>{t('subscriptions.telegram')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
        {linked ? (
          <Button variant="outlined" color="error" disabled={busy} onClick={handleDisconnect}>
            {t('subscriptions.disconnect')}
          </Button>
        ) : fallbackUrl ? (
          <Button variant="outlined" component="a" href={fallbackUrl} target="_blank" rel="noopener noreferrer">
            {t('subscriptions.openTelegram')}
          </Button>
        ) : (
          <Button variant="outlined" disabled={busy} onClick={handleConnect}>
            {t('subscriptions.connect')}
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}
