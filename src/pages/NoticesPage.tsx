import { useMemo, useState } from 'react'
import { Chip, Typography } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DataTable, { type Column } from '../components/DataTable.tsx'
import NoticeDialog from '../components/NoticeDialog.tsx'
import { Async, PageHeader } from '../components/PageState.tsx'
import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { NoticeRow, NoticesPage as NoticesData } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { toNumber } from '../lib/format.ts'

function makeColumns(t: TFunction): Column<NoticeRow>[] {
  return [
  { key: 'number', header: '#', width: 64, sortValue: (row) => toNumber(row.number) },
  {
    key: 'section',
    header: t('notices.section'),
    sortValue: (row) => row.section,
    render: (row) => (row.section ? <Chip size="small" variant="outlined" label={row.section} /> : '—'),
    noWrap: true,
  },
  {
    key: 'subject',
    header: t('notices.subject'),
    sortValue: (row) => row.subject,
    render: (row) => <Typography sx={{ fontWeight: 600, minWidth: 220 }}>{row.subject}</Typography>,
  },
  { key: 'author', header: t('notices.author'), sortValue: (row) => row.author, noWrap: true },
  { key: 'created_at', header: t('notices.date'), sortValue: (row) => row.created_at, noWrap: true },
  {
    key: 'views',
    header: t('notices.views'),
    align: 'right',
    sortValue: (row) => toNumber(row.views),
    render: (row) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <VisibilityOutlinedIcon sx={{ fontSize: 16, opacity: 0.6 }} />
        {row.views || '0'}
      </span>
    ),
  },
  ]
}

export default function NoticesPage() {
  const { t } = useTranslation()
  const columns = useMemo(() => makeColumns(t), [t])
  const notices = useApi<NoticesData>(endpoints.notices)
  const [openId, setOpenId] = useState<string | null>(null)
  const rows = notices.data?.tables.notices ?? []

  return (
    <>
      <PageHeader title={t('notices.title')} description={t('notices.description')} />
      <Async loading={notices.loading} error={notices.error} onRetry={notices.reload} rows={8}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row, index) => row.id || `${row.number}-${index}`}
          searchable
          searchPlaceholder={t('notices.search')}
          defaultSort={{ key: 'created_at', direction: 'desc' }}
          onRowClick={(row) => row.id && setOpenId(row.id)}
          emptyMessage={t('notices.empty')}
          minWidth={760}
        />
      </Async>
      <NoticeDialog noticeId={openId} onClose={() => setOpenId(null)} />
    </>
  )
}
