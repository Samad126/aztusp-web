import { useState } from 'react'
import { Button, ListItemText, Menu, MenuItem } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n/messages.ts'

/** Compact language menu for headers where the full settings control doesn't fit. */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const active = languages.find((item) => item.code === language)

  return (
    <>
      <Button
        color="inherit"
        size="small"
        aria-label={t('settings.language')}
        onClick={(event) => setAnchor(event.currentTarget)}
        startIcon={<TranslateIcon />}
        sx={{ minWidth: 0, color: 'text.secondary' }}
      >
        {compact ? active?.short : active?.label}
      </Button>
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        {languages.map((item) => (
          <MenuItem
            key={item.code}
            selected={item.code === language}
            onClick={() => {
              void i18n.changeLanguage(item.code)
              setAnchor(null)
            }}
          >
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
