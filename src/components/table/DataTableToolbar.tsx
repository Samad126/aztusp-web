import type { ReactNode } from 'react'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

/** The heading, the extra controls and the search box above a table. */
export default function DataTableToolbar({
  title,
  subtitle,
  actions,
  searchable,
  searchLabel,
  query,
  onQueryChange,
}: {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  searchable: boolean
  searchLabel: string
  query: string
  onQueryChange: (value: string) => void
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2.5,
        py: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {title && (
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {actions}
        {searchable && (
          <TextField
            size="small"
            placeholder={searchLabel}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': searchLabel },
            }}
            sx={{ width: { xs: '100%', sm: 240 } }}
          />
        )}
      </Box>
    </Box>
  )
}
