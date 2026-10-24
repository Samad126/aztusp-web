import { useState } from 'react'
import { Async, EmptyState } from '../../components/PageState.tsx'
import MaterialDialog from '../../components/MaterialDialog.tsx'
import TaskDialog from '../../components/TaskDialog.tsx'
import RecordsTable from '../../components/table/RecordsTable.tsx'
import { endpoints } from '../../api/endpoints.ts'
import { useApi } from '../../api/useApi.ts'
import { useTranslation } from 'react-i18next'
import type { CourseItems, CourseTab } from '../../api/types.ts'

export default function ItemsTab({ courseId, tab, emptyTitle }: { courseId: string; tab: CourseTab; emptyTitle: string }) {
  const { t } = useTranslation()
  const items = useApi<CourseItems>(endpoints.courseTab(courseId, tab))
  // A material or task opens its files and text. The other tabs show their rows only.
  const [materialId, setMaterialId] = useState<string | null>(null)
  const opensMaterial = tab === 'materials'
  const [taskId, setTaskId] = useState<string | null>(null)
  const opensTask = tab === 'tasks'

  return (
    <>
      <Async loading={items.loading} error={items.error} onRetry={items.reload} rows={5}>
        {items.data?.items.length === 0 ? (
          <EmptyState title={emptyTitle}>{t('course.emptyHint')}</EmptyState>
        ) : (
          <RecordsTable
            rows={items.data?.items ?? []}
            searchable
            onRowClick={
              opensMaterial
                ? (row) => setMaterialId(row.id || null)
                : opensTask
                  ? (row) => setTaskId(row.id || null)
                  : undefined
            }
          />
        )}
      </Async>
      {opensTask && <TaskDialog courseId={courseId} taskId={taskId} onClose={() => setTaskId(null)} />}
      {opensMaterial && <MaterialDialog materialId={materialId} onClose={() => setMaterialId(null)} />}
    </>
  )
}
