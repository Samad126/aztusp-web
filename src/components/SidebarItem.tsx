import type { ElementType } from 'react'
import type { ListItemButtonProps } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { CircularProgress, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { alpha } from '@mui/material/styles'

const itemSx = {
  minHeight: 56,
  px: 3,
  '& .MuiListItemText-primary': { fontWeight: 500 },
  '&.active': {
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.16),
  },
}

/** One row of the sidebar. Pass a router link or an `href` through `props`; `busy` shows a spinner in place of the icon. */
export default function SidebarItem({
  icon: Icon,
  label,
  busy = false,
  ...props
}: {
  icon: ElementType
  label: string
  // Shows a spinner in place of the icon, like the sign-out button on Settings
  busy?: boolean
  component?: ElementType
  to?: string
  end?: boolean
  replace?: boolean
  href?: string
  target?: string
  rel?: string
} & ListItemButtonProps) {
  return (
    <ListItemButton sx={itemSx} {...props}>
      <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
        {busy ? <CircularProgress size={20} color="inherit" /> : <Icon />}
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}
