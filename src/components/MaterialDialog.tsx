import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { MaterialDetail } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import RecordDialog from './RecordDialog.tsx'

/** A course material (Didaktik materiallar) opened from its course's list. */
export default function MaterialDialog({ materialId, onClose }: { materialId: string | null; onClose: () => void }) {
  const { t } = useTranslation()
  const material = useApi<MaterialDetail>(materialId ? endpoints.material(materialId) : null)
  const data = material.data
  const record = data && {
    title: data.subject,
    meta: [data.author, data.date, data.views && t('materials.viewsCount', { n: data.views })].filter(Boolean).join(' · '),
    attachments: data.attachments,
    body: data.body,
  }

  return (
    <RecordDialog
      open={materialId !== null}
      onClose={onClose}
      record={record}
      loading={material.loading}
      error={material.error}
      onRetry={material.reload}
      attachmentsLabel={t('materials.attachments')}
      noTextLabel={t('materials.noText')}
    />
  )
}
