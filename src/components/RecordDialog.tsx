import { Alert, Box, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import type { Attachment } from '../api/types.ts'
import AttachmentButton from './AttachmentButton.tsx'
import { ErrorState } from './PageState.tsx'

/** What the dialog shows once its record has loaded. */
export interface DialogRecord {
  title: string
  meta: string
  attachments: Attachment[]
  body: string
}

/** The dialog a list row opens: the record's heading, the files to download and the text. Notices and course materials use it. */
export default function RecordDialog({
  open,
  onClose,
  record,
  loading,
  error,
  onRetry,
  attachmentsLabel,
  noTextLabel,
}: {
  open: boolean
  onClose: () => void
  record?: DialogRecord
  loading: boolean
  error?: Error
  onRetry: () => void
  attachmentsLabel: string
  noTextLabel: string
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, pr: 1 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {record ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                {record.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {record.meta}
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
        {loading && (
          <Stack spacing={1}>
            <Skeleton />
            <Skeleton />
            <Skeleton width="70%" />
          </Stack>
        )}
        {error && <ErrorState error={error} onRetry={onRetry} />}
        {record && (
          <Stack spacing={3}>
            {record.attachments.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  {attachmentsLabel}
                </Typography>
                {record.attachments.map((attachment) => (
                  <AttachmentButton key={attachment.file_no || attachment.name} attachment={attachment} />
                ))}
              </Stack>
            )}
            {record.body ? (
              <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{record.body}</Typography>
            ) : (
              <Alert severity="info">{noTextLabel}</Alert>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
