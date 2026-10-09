import { Box, Paper, Typography } from '@mui/material'

export interface KeyValue {
  label: string
  value: string | null | undefined
}

export default function KeyValueGrid({ title, items }: { title?: string; items: KeyValue[] }) {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}>
      {title && (
        <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{ px: 2.5, py: 1.75, borderBottom: 1, borderColor: 'divider', minWidth: 0 }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {item.label}
            </Typography>
            <Typography sx={{ wordBreak: 'break-word', fontWeight: 500 }}>{item.value || '—'}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
