import { endpoints } from '../api/endpoints.ts'
import { useApi } from '../api/useApi.ts'
import type { NoticeDetail } from '../api/types.ts'
import { useTranslation } from 'react-i18next'
import RecordDialog from './RecordDialog.tsx'

export default function NoticeDialog({ noticeId, onClose }: { noticeId: string | null; onClose: () => void }) {
  const { t } = useTranslation()
  const notice = useApi<NoticeDetail>(noticeId ? endpoints.notice(noticeId) : null)
  const data = notice.data
  const record = data && {
    title: data.subject,
    meta: [data.author, data.created_at, data.views && t('notices.viewsCount', { n: data.views })].filter(Boolean).join(' · '),
    attachments: data.attachments,
    body: data.body,
  }

  return (
    <RecordDialog
      open={noticeId !== null}
      onClose={onClose}
      record={record}
      loading={notice.loading}
      error={notice.error}
      onRetry={notice.reload}
      attachmentsLabel={t('notices.attachments')}
      noTextLabel={t('notices.noText')}
    />
  )
}
