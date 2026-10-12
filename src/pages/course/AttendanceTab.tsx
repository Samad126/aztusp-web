import { useMemo } from 'react'
import { Chip, Stack, Tooltip } from '@mui/material'
import KeyValueGrid from '../../components/KeyValueGrid.tsx'
import { Async, EmptyState } from '../../components/PageState.tsx'
import DataTable from '../../components/table/DataTable.tsx'
import type { Column } from '../../components/table/tableRows.ts'
import { endpoints } from '../../api/endpoints.ts'
import { useApi } from '../../api/useApi.ts'
import type { AttendanceStudent, CourseAttendance, ProfilePage } from '../../api/types.ts'
import { fieldLabel } from '../../i18n/index.ts'
import { useTranslation } from 'react-i18next'
import { percentTone, toNumber } from '../../lib/format.ts'
import { findMyRow } from '../../lib/attendance.ts'
import AbsenceSimulation from './attendance/AbsenceSimulation.tsx'
import AttendanceSummary from './attendance/AttendanceSummary.tsx'
import MarkCell from './attendance/MarkCell.tsx'

export default function AttendanceTab({ courseId }: { courseId: string }) {
  const { t } = useTranslation()
  const attendance = useApi<CourseAttendance>(endpoints.courseAttendance(courseId))
  const profile = useApi<ProfilePage>(endpoints.profile)
  const studentId = profile.data?.pairs.info.student_id
  const data = attendance.data

  const columns = useMemo<Column<AttendanceStudent>[]>(() => {
    if (!data) return []
    return [
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
            {mine && <AbsenceSimulation attendance={data} student={mine} />}

            <DataTable
              title={t('attendance.journal')}
              subtitle={mine ? t('attendance.yourRow') : undefined}
              summary={<AttendanceSummary attendance={data} student={mine} />}
              columns={columns}
              rows={data.students}
              getRowKey={(row) => row.student_id || row.number}
              isRowHighlighted={(row) => row.student_id === studentId}
              pageSize={25}
              minWidth={Math.max(360, 200 + data.sessions.length * 44)}
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

            {Object.keys(data.info).length > 0 && (
              <KeyValueGrid
                title={t('attendance.course')}
                items={Object.entries(data.info).map(([key, value]) => ({ label: fieldLabel(key), value }))}
              />
            )}
          </Stack>
        ))}
    </Async>
  )
}
