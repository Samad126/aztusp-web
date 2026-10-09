import { useState } from 'react'
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

export default function PasswordField(props: TextFieldProps) {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label={visible ? t('password.hide') : t('password.show')}
                onClick={() => setVisible((prev) => !prev)}
              >
                {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
