import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import AbsenceInput from '../components/AbsenceInput.tsx'
import DataTable, { type Column } from '../components/DataTable.tsx'
import { Async, PageHeader } from '../components/PageState.tsx'
import { endpoints } from '../api/endpoints.ts'
import { fetchCached, useApi } from '../api/useApi.ts'
import type { Course, CourseAttendance, ProfilePage } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import { countMarks, estimateRate, findMyRow, parseLessons } from '../lib/attendance.ts'
import { formatPercent, percentTone, toNumber } from '../lib/format.ts'

interface Row {
  course: Course
  state: 'loading' | 'error' | 'ready'
  error?: string
  attendance?: CourseAttendance
}

export default function AttendancePage() {
  const { t, i18n } = useTranslation()
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

  const columns = useMemo<Column<Row>[]>(() => {
    const mine = (row: Row) => (row.attendance ? findMyRow(row.attendance, studentId) : undefined)
    const estimate = (row: Row) => (row.attendance ? estimateRate(row.attendance, mine(row), lessons) : null)
    return [
      {
        key: 'course',
        header: t('attendance.course'),
        sortValue: (row) => row.course.name,
        render: (row) => <Typography sx={{ fontWeight: 600, minWidth: 200 }}>{row.course.name}</Typography>,
      },
      {
        key: 'teacher',
        header: t('attendance.teacher'),
        sortValue: (row) => row.attendance?.info.teacher,
        render: (row) => row.attendance?.info.teacher || '—',
      },
      {
        key: 'hours',
        header: t('attendance.hours'),
        align: 'right',
        sortValue: (row) => toNumber(row.attendance?.info.total_hours),
        render: (row) => row.attendance?.info.total_hours || '—',
      },
      {
        key: 'present',
        header: t('attendance.present'),
        align: 'right',
        sortValue: (row) => (row.attendance ? countMarks(mine(row)).present : null),
        render: (row) => (row.attendance ? countMarks(mine(row)).present : '—'),
      },
      {
        key: 'absent',
        header: t('attendance.absent'),
        align: 'right',
        sortValue: (row) => (row.attendance ? countMarks(mine(row)).absent : null),
        render: (row) => {
          if (!row.attendance) return '—'
          const absent = countMarks(mine(row)).absent
          return absent > 0 ? <Chip size="small" color="error" variant="outlined" label={absent} /> : absent
        },
      },
      {
        key: 'score',
        header: t('common.score'),
        align: 'right',
        sortValue: (row) => toNumber(mine(row)?.score),
        render: (row) => mine(row)?.score || '—',
      },
      {
        key: 'rate',
        header: t('attendance.rate'),
        align: 'right',
        // Sorts by the figure shown: the estimate while absences are simulated, otherwise the portal's rate.
        sortValue: (row) => (lessons > 0 ? estimate(row) : null) ?? toNumber(mine(row)?.percent),
        render: (row) => {
          if (row.state === 'loading') return <LinearProgress sx={{ width: 120, ml: 'auto', borderRadius: 3 }} />
          if (row.state === 'error') return <Typography variant="body2" color="error">{row.error}</Typography>
          const percent = toNumber(mine(row)?.percent)
          if (percent === null) return '—'
          // With absences entered, the bar and the new figure show the estimate, and the portal's figure is struck through.
          const estimated = lessons > 0 ? estimate(row) : null
          const shown = estimated ?? percent
          const tone = percentTone(shown)
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: estimated === null ? 136 : 180, ml: 'auto' }}>
              <LinearProgress
                variant="determinate"
                color={tone === 'default' ? 'primary' : tone}
                value={Math.min(100, shown)}
                sx={{ width: 90, height: 6, borderRadius: 3, flexShrink: 0 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {estimated === null ? (
                  `${percent}%`
                ) : (
                  <>
                    <Box component="s" sx={{ color: 'text.secondary', fontWeight: 400, mr: 1 }}>
                      {formatPercent(percent, i18n.language)}
                    </Box>
                    {formatPercent(estimated, i18n.language)}
                  </>
                )}
              </Typography>
            </Box>
          )
        },
      },
    ]
  }, [studentId, t, i18n.language, lessons])

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
