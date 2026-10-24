import { useMemo, useState, type ReactNode } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import DataTableToolbar from './DataTableToolbar.tsx'
import { type Column, type SortState, visibleRows } from './tableRows.ts'

// The pager is shown once a table has more rows than the smallest of these.
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50]

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowKey: (row: T, index: number) => string
  title?: ReactNode
  subtitle?: ReactNode
  /** Extra controls placed beside the search box. */
  actions?: ReactNode
  /** Figures shown between the toolbar and the table. */
  summary?: ReactNode
  searchable?: boolean
  searchPlaceholder?: string
  /** Text matched by the search box. Defaults to the sortable column values. */
  searchText?: (row: T) => string
  pageSize?: number
  /** Disable paging for short tables. */
  paginate?: boolean
  onRowClick?: (row: T) => void
  isRowHighlighted?: (row: T) => boolean
  /** Summary row rendered under the body. */
  footer?: ReactNode
  emptyMessage?: string
  defaultSort?: SortState
  minWidth?: number
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  title,
  subtitle,
  actions,
  summary,
  searchable = false,
  searchPlaceholder,
  searchText,
  pageSize = 50,
  paginate = true,
  onRowClick,
  isRowHighlighted,
  footer,
  emptyMessage,
  defaultSort,
  minWidth = 640,
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const searchLabel = searchPlaceholder ?? t('common.search')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortState | null>(defaultSort ?? null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  const visible = useMemo(
    () => visibleRows(rows, { columns, query, sort, searchText }),
    [rows, query, sort, columns, searchText],
  )

  const lastPage = Math.max(0, Math.ceil(visible.length / rowsPerPage) - 1)
  const safePage = Math.min(page, lastPage)
  const pageRows = paginate
    ? visible.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)
    : visible

  const toggleSort = (key: string) => {
    setSort((current) =>
      current?.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' },
    )
  }

  const hasToolbar = title || subtitle || actions || searchable

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}>
      {hasToolbar && (
        <DataTableToolbar
          title={title}
          subtitle={subtitle}
          actions={actions}
          searchable={searchable}
          searchLabel={searchLabel}
          query={query}
          onQueryChange={(value) => {
            setQuery(value)
            setPage(0)
          }}
        />
      )}

      {summary && <Box sx={{ px: 2.5, py: 1.75, borderBottom: 1, borderColor: 'divider' }}>{summary}</Box>}

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth }} stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sortDirection={sort?.key === column.key ? sort.direction : false}
                  sx={{
                    width: column.width,
                    ...(column.sticky && { position: 'sticky', left: 0, zIndex: 3 }),
                  }}
                >
                  {column.sortValue ? (
                    <TableSortLabel
                      active={sort?.key === column.key}
                      direction={sort?.key === column.key ? sort.direction : 'asc'}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((row, index) => {
              const highlighted = isRowHighlighted?.(row)
              return (
                <TableRow
                  key={getRowKey(row, index)}
                  hover
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={(theme) => ({
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td': { borderBottom: 0 },
                    '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.text.primary, 0.02) },
                    ...(highlighted && {
                      bgcolor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
                    }),
                  })}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={(theme) => ({
                        whiteSpace: column.noWrap ? 'nowrap' : undefined,
                        ...(column.sticky && {
                          position: 'sticky',
                          left: 0,
                          zIndex: 1,
                          // Opaque, so the cells scrolling underneath don't show through: the highlight is laid over the paper.
                          backgroundColor: theme.palette.background.paper,
                          backgroundImage: highlighted
                            ? `linear-gradient(${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.primary.main, 0.16)})`
                            : undefined,
                        }),
                      })}
                    >
                      {column.render ? column.render(row) : (column.sortValue?.(row) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>

          {footer && (
            <TableFooter>
              {footer}
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      {visible.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          <InboxOutlinedIcon sx={{ fontSize: 40, opacity: 0.6 }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {query ? t('common.noMatch') : (emptyMessage ?? t('common.nothing'))}
          </Typography>
        </Box>
      )}

      {paginate && visible.length > ROWS_PER_PAGE_OPTIONS[0] && (
        <TablePagination
          component="div"
          count={visible.length}
          page={safePage}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage={t('common.rowsPerPage')}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      )}
    </Paper>
  )
}
