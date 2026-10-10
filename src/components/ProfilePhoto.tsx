import { useRef, useState, type ChangeEvent } from 'react'
import { Alert, Button, CircularProgress, Paper, Skeleton, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import { useTranslation } from 'react-i18next'
import { ApiError } from '../api/client.ts'
import { PHOTO_MAX_BYTES, PHOTO_TYPES, deletePhoto, uploadPhoto, usePhotoUrl } from '../api/photo.ts'
import { useAuth } from '../auth/AuthContext.ts'
import PhotoAvatar from './PhotoAvatar.tsx'
import { initials } from '../lib/format.ts'

export default function ProfilePhoto() {
  const { t } = useTranslation()
  const { username } = useAuth()
  const photo = usePhotoUrl()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<'upload' | 'remove' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const run = async (action: 'upload' | 'remove', request: () => Promise<void>, done: string) => {
    setBusy(action)
    setError(null)
    setNotice(null)
    try {
      await request()
      setNotice(done)
    } catch (caught) {
      // The server checks the same limits, so its answer for a file that is too large or the wrong type is translated.
      if (caught instanceof ApiError && caught.status === 413) setError(t('photo.tooLarge'))
      else if (caught instanceof ApiError && caught.status === 415) setError(t('photo.wrongType'))
      else setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(null)
    }
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Cleared so the same file can be picked again after an error.
    event.target.value = ''
    if (!file) return
    if (!PHOTO_TYPES.includes(file.type)) {
      setNotice(null)
      setError(t('photo.wrongType'))
      return
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setNotice(null)
      setError(t('photo.tooLarge'))
      return
    }
    void run('upload', () => uploadPhoto(file), t('photo.uploaded'))
  }

  return (
    <Paper elevation={0} sx={{ maxWidth: 720, px: 3, py: 2.5, border: 1, borderColor: 'divider' }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t('photo.title')}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
        {t('photo.description')}
      </Typography>
      <input ref={inputRef} type="file" accept={PHOTO_TYPES.join(',')} hidden onChange={handleFile} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2.5}
        useFlexGap
        sx={{ mt: 2.5, alignItems: { xs: 'flex-start', sm: 'center' } }}
      >
        {photo === undefined ? (
          <Skeleton variant="circular" width={96} height={96} />
        ) : (
          <PhotoAvatar
            alt={username ?? ''}
            src={photo}
            sx={{ width: 96, height: 96, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 32, fontWeight: 700 }}
          >
            {initials(username ?? '')}
          </PhotoAvatar>
        )}

        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            disabled={busy !== null}
            onClick={() => inputRef.current?.click()}
            startIcon={busy === 'upload' ? <CircularProgress size={16} color="inherit" /> : <PhotoCameraOutlinedIcon />}
          >
            {photo ? t('photo.replace') : t('photo.upload')}
          </Button>
          {photo && (
            <Button
              variant="outlined"
              color="error"
              disabled={busy !== null}
              onClick={() => void run('remove', deletePhoto, t('photo.removed'))}
              startIcon={busy === 'remove' ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            >
              {t('photo.remove')}
            </Button>
          )}
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2.5 }}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mt: 2.5 }}>
          {notice}
        </Alert>
      )}
    </Paper>
  )
}
