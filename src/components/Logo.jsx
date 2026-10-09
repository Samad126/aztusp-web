import { Box } from '@mui/material'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'

export default function Logo() {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 1,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <HubOutlinedIcon />
    </Box>
  )
}
