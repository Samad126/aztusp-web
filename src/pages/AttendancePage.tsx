import { useState } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import SemesterToolbar from '../components/SemesterToolbar.tsx'

const rows = [
  {
    code: 'CS101',
    course: 'Introduction to programming',
    instructor: 'Alex Brown',
    credits: '2+2+0',
    hours: 30,
    limit: 7.5,
    attended: 26,
    absent: 0,
    rate: 0,
  },
  {
    code: 'CS102',
    course: 'Computer-aided design',
    instructor: 'Maria Green',
    credits: '2+2+0',
    hours: 30,
    limit: 7.5,
    attended: 23,
    absent: 1,
    rate: 2,
  },
  {
    code: 'EN030',
    course: 'Academic English',
    instructor: 'Chris White',
    credits: '0+8+0',
    hours: 120,
    limit: 30,
    attended: 99,
    absent: 5,
    rate: 5,
  },
  {
    code: 'MA136',
    course: 'Linear algebra',
    instructor: 'Sam Black',
    credits: '2+1+0',
    hours: 30,
    limit: 7.5,
    attended: 24,
    absent: 0,
    rate: 0,
  },
  {
    code: 'CS136',
    course: 'Web technologies',
    instructor: 'Lee Gray',
    credits: '2+2+0',
    hours: 30,
    limit: 7.5,
    attended: 28,
    absent: 2,
    rate: 4,
  },
]

export default function AttendancePage() {
  const [includeRate, setIncludeRate] = useState(true)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const sortedRows = [...rows].sort(
    (a, b) => a.course.localeCompare(b.course) * (order === 'asc' ? 1 : -1),
  )

  return (
    <>
      <SemesterToolbar>
        <FormControlLabel
          control={
            <Checkbox checked={includeRate} onChange={(event) => setIncludeRate(event.target.checked)} />
          }
          label="Show absence rate"
        />
      </SemesterToolbar>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell sortDirection={order}>
                <TableSortLabel
                  active
                  direction={order}
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                >
                  Course
                </TableSortLabel>
              </TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell align="right">Credits</TableCell>
              <TableCell align="right">Hours</TableCell>
              <TableCell align="right">Limit</TableCell>
              <TableCell align="right">Attended</TableCell>
              <TableCell align="right">Absent</TableCell>
              {includeRate && <TableCell align="right">Rate</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.code} hover>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.instructor}</TableCell>
                <TableCell align="right">{row.credits}</TableCell>
                <TableCell align="right">{row.hours}</TableCell>
                <TableCell align="right">{row.limit}</TableCell>
                <TableCell align="right">{row.attended}</TableCell>
                <TableCell align="right">{row.absent}</TableCell>
                {includeRate && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.rate}
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 36 }}>
                        {row.rate}%
                      </Typography>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
