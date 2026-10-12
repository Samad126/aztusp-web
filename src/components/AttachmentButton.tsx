import { useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DownloadIcon from '@mui/icons-material/Download'
import { useTranslation } from 'react-i18next'
import { downloadFile } from '../api/client.ts'
import type { Attachment } from '../api/types.ts'

/** An attached file of a notice or material. Clicking it downloads through the API, since the file needs the sign-in token. */
export default function AttachmentButton({ attachment }: { attachment: Attachment }) {
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
