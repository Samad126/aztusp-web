import { Box, Typography } from '@mui/material'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import StatCard from '../components/StatCard.jsx'

const stats = [
  { label: 'Current courses', value: 3, icon: MenuBookOutlinedIcon },
  { label: 'Completed credits', value: 120, icon: DonutLargeOutlinedIcon },
  { label: 'Balance due', value: '$0', icon: BookmarkBorderOutlinedIcon },
  { label: 'GPA', value: '3.90', icon: SchoolOutlinedIcon },
  { label: 'Progress', value: '0.00%', icon: WorkspacePremiumOutlinedIcon, tone: 'error' },
]

const details = [
  { label: 'Advisor', value: 'Jane Smith' },
  { label: 'Email', value: 'jane.doe@example.com' },
  { label: 'Date of birth', value: '2000-01-01' },
  { label: 'Entrance score', value: '600.0' },
  { label: 'Thesis topic', value: 'Not set' },
  { label: 'Dormitory balance', value: '0' },
  { label: 'Full name', value: 'Jane Doe' },
  { label: 'Group', value: 'A-101' },
  { label: 'Status', value: 'Active' },
  { label: 'Enrollment date', value: '2022-09-01' },
  { label: 'Student ID', value: '000000' },
]

export default function HomePage() {
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 4 }}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        {details.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              py: 1.75,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography>{item.label}</Typography>
            <Typography sx={{ textAlign: 'right' }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}
