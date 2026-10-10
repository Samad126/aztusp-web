import { useMemo, useState, type ReactNode } from 'react'
import {
  Box,
  InputAdornment,
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
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

export interface Column<T> {
  key: string
  header: ReactNode
  /** Cell content. Defaults to `sortValue`. */
  render?: (row: T) => ReactNode
  /** Value used for sorting and search. Without it the column can't be sorted. */
  sortValue?: (row: T) => string | number | null | undefined
  align?: 'left' | 'right' | 'center'
  width?: number | string
  /** Keeps the column visible while scrolling horizontally. */
  sticky?: boolean
  noWrap?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowKey: (row: T, index: number) => string
  title?: ReactNode
  subtitle?: ReactNode
  /** Extra controls placed beside the search box. */
  actions?: ReactNode
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
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  minWidth?: number
}

function compare(a: string | number | null | undefined, b: string | number | null | undefined) {
  const blankA = a === null || a === undefined || a === ''
  const blankB = b === null || b === undefined || b === ''
  if (blankA || blankB) return blankA === blankB ? 0 : blankA ? 1 : -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  title,
  subtitle,
  actions,
  searchable = false,
  searchPlaceholder,
  searchText,
  pageSize = 10,
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
  const [sort, setSort] = useState(defaultSort ?? null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let result = rows
    if (needle) {
      result = rows.filter((row) => {
        const text =
          searchText?.(row) ??
          columns.map((column) => column.sortValue?.(row) ?? '').join(' ')
        return text.toLowerCase().includes(needle)
      })
    }
    const column = columns.find((item) => item.key === sort?.key)
    if (column?.sortValue && sort) {
      const { sortValue } = column
      const factor = sort.direction === 'asc' ? 1 : -1
      result = [...result].sort((a, b) => compare(sortValue(a), sortValue(b)) * factor)
    }
    return result
  }, [rows, query, sort, columns, searchText])

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
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 2.5,
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {actions}
            {searchable && (
              <TextField
                size="small"
                placeholder={searchLabel}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(0)
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { 'aria-label': searchLabel },
                }}
                sx={{ width: { xs: '100%', sm: 240 } }}
              />
            )}
          </Box>
        </Box>
      )}

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

      {paginate && visible.length > 10 && (
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
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage={t('common.rowsPerPage')}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      )}
    </Paper>
  )
}
