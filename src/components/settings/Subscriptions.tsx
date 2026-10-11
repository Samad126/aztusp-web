import { useCallback, useEffect, useState } from 'react'
import { Box, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ApiError, apiGet } from '../../api/client.ts'
import { endpoints } from '../../api/endpoints.ts'
import type { Subscription, TelegramStatus } from '../../api/types.ts'
import { Async } from '../PageState.tsx'
import SettingsSection from './SettingsSection.tsx'
import SubscriptionForm from './SubscriptionForm.tsx'
import TelegramRow from './TelegramRow.tsx'

interface Loaded {
  subscription: Subscription | null
  telegramLinked: boolean
}

// The API answers 404 while change notifications are off.
function fetchSubscription() {
  return apiGet<Subscription>(endpoints.notifications).catch((caught: unknown) => {
    if (caught instanceof ApiError && caught.status === 404) return null
    throw caught
  })
}

export default function Subscriptions() {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(
    () =>
      Promise.all([fetchSubscription(), apiGet<TelegramStatus>(endpoints.telegram)]).then(
        ([subscription, telegram]) => {
          setLoaded({ subscription, telegramLinked: telegram.linked })
          setError(null)
        },
        (caught: unknown) => setError(caught instanceof Error ? caught : new Error(String(caught))),
      ),
    [],
  )

  useEffect(() => {
    void load()
  }, [load])

  return (
    <SettingsSection title={t('subscriptions.title')} description={t('subscriptions.description')}>
      <Box sx={{ mt: 2.5 }}>
        <Async loading={!loaded && !error} error={error ?? undefined} onRetry={load} rows={3}>
          {loaded && (
            <>
              <TelegramRow linked={loaded.telegramLinked} onChanged={load} />
              <Divider sx={{ my: 2.5 }} />
              <SubscriptionForm
                current={loaded.subscription}
                telegramLinked={loaded.telegramLinked}
                onChanged={load}
              />
            </>
          )}
        </Async>
      </Box>
    </SettingsSection>
  )
}
