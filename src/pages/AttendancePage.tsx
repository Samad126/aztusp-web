import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import AbsenceInput from '../components/AbsenceInput.tsx'
import { Async, PageHeader } from '../components/PageState.tsx'
import DataTable from '../components/table/DataTable.tsx'
import { endpoints } from '../api/endpoints.ts'
import { fetchCached, useApi } from '../api/useApi.ts'
import type { Course, CourseAttendance, ProfilePage } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import { parseLessons } from '../lib/attendance.ts'
import { attendanceColumns } from './attendance/columns.tsx'
import type { Row } from './attendance/rows.ts'

export default function AttendancePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const courses = useApi<Course[]>(endpoints.courses)
  const profile = useApi<ProfilePage>(endpoints.profile)
  const studentId = profile.data?.pairs.info.student_id
  const [results, setResults] = useState<Record<string, Row>>({})
  const [nonce, setNonce] = useState(0)
  const [absence, setAbsence] = useState('')
  const lessons = parseLessons(absence)

  // One request per course; each row fills in as soon as its own response arrives.
  useEffect(() => {
    if (!courses.data) return
    let active = true
    for (const course of courses.data) {
      fetchCached<CourseAttendance>(endpoints.courseAttendance(course.lec_open_idx), nonce > 0)
        .then((attendance) => active && setResults((prev) => ({ ...prev, [course.lec_open_idx]: { course, state: 'ready', attendance } })))
        .catch((error: Error) => active && setResults((prev) => ({ ...prev, [course.lec_open_idx]: { course, state: 'error', error: error.message } })))
    }
    return () => {
      active = false
    }
  }, [courses.data, nonce])

  const rows = useMemo<Row[]>(
    () => (courses.data ?? []).map((course) => results[course.lec_open_idx] ?? { course, state: 'loading' }),
    [courses.data, results],
  )

  const columns = useMemo(() => attendanceColumns(t, studentId, lessons), [t, studentId, lessons])

  return (
    <>
      <PageHeader
        title={t('attendance.title')}
        description={t('attendance.description')}
      />
      <Box sx={{ mb: 2 }}>
        <AbsenceInput value={absence} onChange={setAbsence} helperText={t('absence.overviewHint')} />
      </Box>
      <Async
        loading={courses.loading}
        error={courses.error}
        onRetry={() => {
          courses.reload()
          setNonce((value) => value + 1)
        }}
        rows={5}
      >
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.course.lec_open_idx}
          paginate={false}
          searchable={rows.length > 8}
          onRowClick={(row) => navigate(`/courses/${encodeURIComponent(row.course.lec_open_idx)}?tab=attendance`)}
          emptyMessage={t('attendance.noCourses')}
          minWidth={820}
        />
      </Async>
    </>
  )
}
