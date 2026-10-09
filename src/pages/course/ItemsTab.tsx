import { Async, EmptyState } from '../../components/PageState.tsx'
import RecordsTable from '../../components/RecordsTable.tsx'
import { endpoints } from '../../api/endpoints.ts'
import { useApi } from '../../api/useApi.ts'
import { useTranslation } from 'react-i18next'
import type { CourseItems, CourseTab } from '../../api/types.ts'

export default function ItemsTab({ courseId, tab, emptyTitle }: { courseId: string; tab: CourseTab; emptyTitle: string }) {
  const { t } = useTranslation()
  const items = useApi<CourseItems>(endpoints.courseTab(courseId, tab))

  return (
    <Async loading={items.loading} error={items.error} onRetry={items.reload} rows={5}>
      {items.data?.items.length === 0 ? (
        <EmptyState title={emptyTitle}>{t('course.emptyHint')}</EmptyState>
      ) : (
        <RecordsTable rows={items.data?.items ?? []} searchable />
      )}
    </Async>
  )
}
