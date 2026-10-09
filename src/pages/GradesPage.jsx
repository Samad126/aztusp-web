import { useState } from 'react'
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import SemesterToolbar from '../components/SemesterToolbar.jsx'

const rows = [
  { code: 'CS101', course: 'Introduction to programming', quiz1: 8, quiz2: 9, seminar: 14, project: 10, exam: null },
  { code: 'CS201', course: 'Data structures', quiz1: 10, quiz2: 9, seminar: 18, project: 10, exam: null },
  { code: 'MA136', course: 'Linear algebra', quiz1: 7, quiz2: 8, seminar: 12, project: 9, exam: null },
  { code: 'EN030', course: 'Academic English', quiz1: 9, quiz2: 10, seminar: 19, project: 10, exam: 35 },
  { code: 'CS136', course: 'Web technologies', quiz1: 10, quiz2: 10, seminar: 20, project: 9, exam: null },
]

const total = (row) => row.quiz1 + row.quiz2 + row.seminar + row.project + (row.exam ?? 0)

export default function GradesPage() {
  const [order, setOrder] = useState('asc')

  const sortedRows = [...rows].sort(
    (a, b) => a.course.localeCompare(b.course) * (order === 'asc' ? 1 : -1),
  )

  return (
    <>
      <SemesterToolbar />

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
              <TableCell align="right">Quiz 1</TableCell>
              <TableCell align="right">Quiz 2</TableCell>
              <TableCell align="right">Seminar</TableCell>
              <TableCell align="right">Project</TableCell>
              <TableCell align="right">Exam</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.code} hover>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell align="right">{row.quiz1}</TableCell>
                <TableCell align="right">{row.quiz2}</TableCell>
                <TableCell align="right">{row.seminar}</TableCell>
                <TableCell align="right">{row.project}</TableCell>
                <TableCell align="right">{row.exam ?? '—'}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {total(row)}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label={`Details for ${row.course}`}>
                    <FactCheckOutlinedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
