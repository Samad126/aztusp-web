import { useMemo } from 'react'
import { Box, Chip, LinearProgress, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import DataTable, { type Column } from '../../components/DataTable.tsx'
import KeyValueGrid from '../../components/KeyValueGrid.tsx'
import { Async, EmptyState } from '../../components/PageState.tsx'
import { endpoints } from '../../api/endpoints.ts'
import { useApi } from '../../api/useApi.ts'
import type { AttendanceMark, AttendanceStudent, CourseAttendance, ProfilePage } from '../../api/types.ts'
import { fieldLabel } from '../../i18n/index.ts'
import { useTranslation } from 'react-i18next'
import { percentTone, toNumber } from '../../lib/format.ts'
import { countMarks, findMyRow } from '../../lib/attendance.ts'

const markColor = {
  present: 'success',
  absent: 'error',
  not_entered: 'text',
} as const

function MarkCell({ mark, date }: { mark: AttendanceMark | undefined; date: string | null }) {
  const { t } = useTranslation()
  if (!mark) return <span>—</span>
  const tone = mark.mark ? markColor[mark.mark] : 'text'
  const label = mark.status || '·'
  return (
    <Tooltip title={`${date ?? t('attendance.notHeld')}${mark.mark ? ` — ${t(`attendance.${mark.mark}.long` as const)}` : ''}`} arrow>
      <Box
        sx={(theme) => {
          const base = tone === 'text' ? theme.palette.text.secondary : theme.palette[tone].main
          return {
            display: 'inline-grid',
            placeItems: 'center',
            minWidth: 28,
            height: 28,
            px: 0.5,
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 700,
            color: base,
            bgcolor: alpha(base, tone === 'text' ? 0.08 : 0.16),
          }
        }}
      >
        {label}
      </Box>
    </Tooltip>
  )
}

export function AttendanceSummary({ attendance, student }: { attendance: CourseAttendance; student: AttendanceStudent | undefined }) {
  const { t } = useTranslation()
  const counts = countMarks(student)
  const percent = toNumber(student?.percent ?? attendance.header.percent)
  const tone = percentTone(percent)

  const stats = [
    { label: t('attendance.rate'), value: student?.percent ?? attendance.header.percent ?? '—' },
    { label: t('common.score'), value: student?.score ?? attendance.header.score ?? '—' },
    { label: t('attendance.present'), value: counts.present },
    { label: t('attendance.absent'), value: counts.absent },
    { label: t('attendance.held'), value: attendance.sessions.filter((session) => session.date).length },
    { label: t('attendance.planned'), value: attendance.sessions.length },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
      }}
    >
      {stats.map((stat, index) => (
        <Paper key={stat.label} elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {stat.label}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: index === 0 && tone !== 'default' ? `${tone}.main` : 'text.primary' }}
          >
            {stat.value}
          </Typography>
          {index === 0 && (
            <LinearProgress
              variant="determinate"
              color={tone === 'default' ? 'primary' : tone}
              value={Math.min(100, percent ?? 0)}
              sx={{ mt: 1, height: 6, borderRadius: 3 }}
            />
          )}
        </Paper>
      ))}
    </Box>
  )
}

export default function AttendanceTab({ courseId }: { courseId: string }) {
  const { t } = useTranslation()
  const attendance = useApi<CourseAttendance>(endpoints.courseAttendance(courseId))
  const profile = useApi<ProfilePage>(endpoints.profile)
  const studentId = profile.data?.pairs.info.student_id
  const data = attendance.data

  const columns = useMemo<Column<AttendanceStudent>[]>(() => {
    if (!data) return []
    return [
      {
        key: 'name',
        header: t('attendance.student'),
        sticky: true,
        noWrap: true,
        sortValue: (row) => row.name,
        render: (row) => <strong>{row.name}</strong>,
      },
      { key: 'student_id', header: t('attendance.id'), sortValue: (row) => row.student_id, noWrap: true },
      ...data.sessions.map<Column<AttendanceStudent>>((session, index) => ({
        key: `s${session.number}`,
        header: (
          <Tooltip title={session.date ?? t('attendance.notHeld')} arrow>
            <span>{session.number}</span>
          </Tooltip>
        ),
        align: 'center',
        render: (row) => (
          <MarkCell
            mark={row.marks.find((mark) => mark.session === session.number) ?? row.marks[index]}
            date={session.date}
          />
        ),
      })),
      { key: 'score', header: t('common.score'), align: 'right', sortValue: (row) => toNumber(row.score), render: (row) => row.score ?? '—' },
      {
        key: 'percent',
        header: t('attendance.rate'),
        align: 'right',
        noWrap: true,
        sortValue: (row) => toNumber(row.percent),
        render: (row) => {
          const tone = percentTone(toNumber(row.percent))
          return <Chip size="small" color={tone} variant={tone === 'default' ? 'outlined' : 'filled'} label={row.percent ?? '—'} />
        },
      },
    ]
  }, [data, t])

  const mine = data ? findMyRow(data, studentId) : undefined

  return (
    <Async loading={attendance.loading} error={attendance.error} onRetry={attendance.reload} rows={6}>
      {data &&
        (data.students.length === 0 && data.sessions.length === 0 ? (
          <EmptyState title={t('attendance.noJournal')}>{t('attendance.noJournalHint')}</EmptyState>
        ) : (
          <Stack spacing={3}>
            <AttendanceSummary attendance={data} student={mine} />

            {Object.keys(data.info).length > 0 && (
              <KeyValueGrid
                title={t('attendance.course')}
                items={Object.entries(data.info).map(([key, value]) => ({ label: fieldLabel(key), value }))}
              />
            )}

            <DataTable
              title={t('attendance.journal')}
              subtitle={mine ? t('attendance.yourRow') : undefined}
              columns={columns}
              rows={data.students}
              getRowKey={(row) => row.student_id || row.number}
              isRowHighlighted={(row) => row.student_id === studentId}
              searchable
              searchPlaceholder={t('attendance.searchStudents')}
              pageSize={25}
              minWidth={Math.max(720, 280 + data.sessions.length * 44)}
              actions={
                Object.keys(data.legend).length > 0 && (
                  <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                    {Object.entries(data.legend).map(([label, code]) => (
                      <Chip key={label} size="small" variant="outlined" label={`${code} · ${label}`} />
                    ))}
                  </Stack>
                )
              }
            />
          </Stack>
        ))}
    </Async>
  )
}
