import { useState, type ReactNode } from 'react'
import { Box, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'

const years = ['2023', '2024', '2025']

export default function SemesterToolbar({ children }: { children?: ReactNode }) {
  const [year, setYear] = useState(years[1])
  const [semester, setSemester] = useState('2')

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          select
          size="small"
          label="Academic year"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          {years.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={semester}
          onChange={(_, value) => {
            if (value) setSemester(value)
          }}
        >
          <ToggleButton value="1">1</ToggleButton>
          <ToggleButton value="2">2</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {children}
    </Box>
  )
}
