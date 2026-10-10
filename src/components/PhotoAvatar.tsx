import { useState, type ReactNode } from 'react'
import { Avatar, Box, ButtonBase, Dialog, IconButton, type SxProps, type Theme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

interface Props {
  /** The profile photo's blob URL; without one the avatar shows `children` (the initials). */
  src: string | null | undefined
  alt: string
  sx?: SxProps<Theme>
  children?: ReactNode
}

/** An avatar that, when there is a photo, opens it at full size in a popup. */
export default function PhotoAvatar({ src, alt, sx, children }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  if (!src) {
    return (
      <Avatar alt={alt} sx={sx}>
        {children}
      </Avatar>
    )
  }

  return (
    <>
      <ButtonBase
        onClick={() => setOpen(true)}
        aria-label={t('photo.view')}
        sx={{ borderRadius: '50%', flexShrink: 0 }}
      >
        <Avatar alt={alt} src={src} sx={sx}>
          {children}
        </Avatar>
      </ButtonBase>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            aria-label={t('common.close')}
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={src}
            alt={alt}
            sx={{ display: 'block', width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }}
          />
        </Box>
      </Dialog>
    </>
  )
}
