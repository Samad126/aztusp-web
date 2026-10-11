import type { ReactNode } from 'react'

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

export interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

// Blank values sort last whichever way the column runs. Numbers compare as numbers, text as text (so "10" follows "9").
function compare(a: string | number | null | undefined, b: string | number | null | undefined) {
  const blankA = a === null || a === undefined || a === ''
  const blankB = b === null || b === undefined || b === ''
  if (blankA || blankB) return blankA === blankB ? 0 : blankA ? 1 : -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/** The rows a table shows: the ones the search matches, in the order of the chosen column. */
export function visibleRows<T>(
  rows: T[],
  {
    columns,
    query,
    sort,
    searchText,
  }: { columns: Column<T>[]; query: string; sort: SortState | null; searchText?: (row: T) => string },
): T[] {
  const needle = query.trim().toLowerCase()
  let result = rows
  if (needle) {
    result = rows.filter((row) => {
      const text = searchText?.(row) ?? columns.map((column) => column.sortValue?.(row) ?? '').join(' ')
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
}
