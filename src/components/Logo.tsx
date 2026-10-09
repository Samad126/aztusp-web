import { Box } from '@mui/material'

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <Box
      component="img"
      src="/aztu-logo.png"
      alt="AZTU"
      sx={{ width: size, height: size, flexShrink: 0, borderRadius: 1, display: 'block' }}
    />
  )
}
