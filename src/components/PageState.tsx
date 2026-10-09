import type { ReactNode } from 'react'
import { Alert, Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { useTranslation } from 'react-i18next'

export function LoadingBlock({ rows = 5 }: { rows?: number }) {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2.5 }} aria-busy="true">
      <Skeleton width="30%" height={28} />
      <Stack spacing={1.25} sx={{ mt: 2 }}>
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={36} />
        ))}
      </Stack>
    </Paper>
  )
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  const { t } = useTranslation()

  return (
    <Alert
      severity="error"
      variant="outlined"
      action={
        onRetry && (
          <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
            {t('common.retry')}
          </Button>
        )
      }
    >
      {error.message}
    </Alert>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', py: 7, px: 3, textAlign: 'center', color: 'text.secondary' }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 44, opacity: 0.6 }} />
      <Typography sx={{ mt: 1, fontWeight: 600, color: 'text.primary' }}>{title}</Typography>
      {children && (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {children}
        </Typography>
      )}
    </Paper>
  )
}

/** Shows the right placeholder for a request that has no data yet, otherwise the children. */
export function Async({
  loading,
  error,
  onRetry,
  rows,
  children,
}: {
  loading: boolean
  error?: Error
  onRetry?: () => void
  rows?: number
  children: ReactNode
}) {
  if (loading) return <LoadingBlock rows={rows} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  return <>{children}</>
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
  )
}
