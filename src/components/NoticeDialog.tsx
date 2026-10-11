import { Alert, Box, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { NoticeDetail } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import AttachmentButton from './AttachmentButton.tsx'
import { ErrorState } from './PageState.tsx'

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
