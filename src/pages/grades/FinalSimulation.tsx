import { Alert, Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { CourseGrades } from '../../api/types.ts'
import { FINAL_MAX, LETTER_SCALE, courseTotal, letterFor, examPoints, neededOnFinal, scholarshipFor, semesterPoints } from '../../lib/grades.ts'
import LetterChip from './LetterChip.tsx'

interface FinalSimulationProps {
  courses: CourseGrades[]
  /** Exam scores typed so far, by course. */
  values: Record<string, string>
  onChange: (courseId: string, value: string) => void
}

/** What-if tool: type the exam score you expect per course, and see the total, letter, what each letter needs and the scholarship. Nothing is saved. */
export default function FinalSimulation({ courses, values, onChange }: FinalSimulationProps) {
  const { t } = useTranslation()
  const open = courses.filter((course) => examPoints(course, undefined).points === null)
  const totals = courses.map((course) => courseTotal(course, values[course.lec_open_idx])?.total ?? null)
  const complete = totals.every((total): total is number => total !== null)
  const scholarship = complete ? scholarshipFor(totals) : null
  const anySimulated = courses.some((course) => courseTotal(course, values[course.lec_open_idx])?.simulated)

  if (open.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {t('grades.simTitle')}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {t('grades.simDescription', { max: FINAL_MAX })}
      </Typography>

      <TableContainer>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('courses.course')}</TableCell>
              <TableCell align="right">{t('grades.semesterPoints')}</TableCell>
              <TableCell align="right" sx={{ width: 150 }}>{t('grades.expectedFinal')}</TableCell>
              <TableCell align="center">{t('grades.simResult')}</TableCell>
              {[...LETTER_SCALE].reverse().map(({ letter }) => (
                <TableCell key={letter} align="center">{t('grades.needFor', { letter })}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {open.map((course) => {
              const result = courseTotal(course, values[course.lec_open_idx])
              return (
                <TableRow key={course.lec_open_idx}>
                  <TableCell>{course.course}</TableCell>
                  <TableCell align="right">{semesterPoints(course)}</TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      value={values[course.lec_open_idx] ?? ''}
                      onChange={(event) => onChange(course.lec_open_idx, event.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder={`0–${FINAL_MAX}`}
                      slotProps={{ htmlInput: { inputMode: 'numeric', 'aria-label': t('grades.expectedFinal') } }}
                      sx={{ width: 90 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {result ? (
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <strong>{result.total}</strong>
                        <LetterChip letter={letterFor(result.total)} simulated />
                      </Stack>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  {[...LETTER_SCALE].reverse().map(({ letter, min }) => {
                    const needed = neededOnFinal(course, min)
                    return (
                      <TableCell key={letter} align="center" sx={{ color: needed === null ? 'text.disabled' : undefined }}>
                        {needed === null ? '—' : needed}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        {anySimulated && complete ? (
          scholarship ? (
            <Alert severity="success">{t('grades.simScholarship', { name: t(`grades.${scholarship}`) })}</Alert>
          ) : (
            <Alert severity="warning">{t('grades.simNoScholarship')}</Alert>
          )
        ) : (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('grades.simHint')}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}
