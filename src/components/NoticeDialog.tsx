import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DownloadIcon from '@mui/icons-material/Download'
import { downloadFile } from '../api/client.ts'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { NoticeAttachment, NoticeDetail } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import { ErrorState } from './PageState.tsx'

function AttachmentButton({ attachment }: { attachment: NoticeAttachment }) {
  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setBusy(true)
    setError(null)
    try {
      await downloadFile(attachment.download, attachment.name)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.download'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        disabled={busy || !attachment.download}
        onClick={handleClick}
        startIcon={busy ? <CircularProgress size={16} /> : <AttachFileIcon />}
        endIcon={<DownloadIcon />}
        sx={{ maxWidth: '100%', justifyContent: 'flex-start' }}
      >
        <Typography noWrap variant="body2">
          {attachment.name}
        </Typography>
      </Button>
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default function NoticeDialog({ noticeId, onClose }: { noticeId: string | null; onClose: () => void }) {
  const { t } = useTranslation()
  const notice = useApi<NoticeDetail>(noticeId ? endpoints.notice(noticeId) : null)
  const data = notice.data

  return (
    <Dialog open={noticeId !== null} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, pr: 1 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {data ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                {data.subject}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {[data.author, data.created_at, data.views && t('notices.viewsCount', { n: data.views })].filter(Boolean).join(' · ')}
              </Typography>
            </>
          ) : (
            <Skeleton width="60%" />
          )}
        </Box>
        <IconButton aria-label={t('common.close')} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {notice.loading && (
          <Stack spacing={1}>
            <Skeleton />
            <Skeleton />
            <Skeleton width="70%" />
          </Stack>
        )}
        {notice.error && <ErrorState error={notice.error} onRetry={notice.reload} />}
        {data && (
          <Stack spacing={3}>
            {data.attachments.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  {t('notices.attachments')}
                </Typography>
                {data.attachments.map((attachment) => (
                  <AttachmentButton key={attachment.file_no || attachment.name} attachment={attachment} />
                ))}
              </Stack>
            )}
            {data.body ? (
              <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{data.body}</Typography>
            ) : (
              <Alert severity="info">{t('notices.noText')}</Alert>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
