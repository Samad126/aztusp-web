import { useMemo } from 'react'
import { Link } from '@mui/material'
import DataTable, { type Column } from './DataTable.tsx'
import { fieldLabel } from '../i18n/index.ts'
import { useTranslation } from 'react-i18next'
import { isUrl } from '../lib/format.ts'

const HIDDEN_KEYS = new Set(['id', 'link'])

/** A table for records whose columns aren't known up front (plan blocks, course tabs, timetable). */
export default function RecordsTable({
  rows,
  title,
  subtitle,
  emptyMessage,
  searchable,
  hiddenKeys = HIDDEN_KEYS,
  minWidth,
}: {
  rows: Record<string, string>[]
  title?: string
  subtitle?: string
  emptyMessage?: string
  searchable?: boolean
  hiddenKeys?: Set<string>
  minWidth?: number
}) {
  const { t } = useTranslation()

  const columns = useMemo(() => {
    const keys: string[] = []
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (!keys.includes(key) && !hiddenKeys.has(key)) keys.push(key)
      }
    }
    return keys.map<Column<Record<string, string>>>((key) => ({
      key,
      header: fieldLabel(key),
      sortValue: (row) => row[key],
      render: (row) => {
        const value = row[key] ?? ''
        if (isUrl(value)) {
          return (
            <Link href={value} target="_blank" rel="noreferrer" underline="hover">
              {t('common.open')}
            </Link>
          )
        }
        return <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
      },
    }))
    // `t` changes with the language, which also refreshes the header text fieldLabel reads.
  }, [rows, hiddenKeys, t])

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(_, index) => String(index)}
      title={title}
      subtitle={subtitle}
      emptyMessage={emptyMessage ?? t('common.nothingListed')}
      searchable={searchable ?? rows.length > 8}
      minWidth={minWidth ?? Math.max(480, columns.length * 140)}
    />
  )
}
