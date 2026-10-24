import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, Link, Stack, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useTranslation } from 'react-i18next'
import { apiPostForm } from '../api/client.ts'
import { useApi } from '../api/useApi.ts'
import { endpoints } from '../api/endpoints.ts'
import type { TaskDetail } from '../api/types.ts'
import { formatDate } from '../lib/format.ts'
import KeyValueGrid from './KeyValueGrid.tsx'
import RecordDialog from './RecordDialog.tsx'

const MAX_FILE_BYTES = 20 * 1024 * 1024

/** A course task (Qiymətləndirmə) opened from its course's list: its details, the teacher's files and the hand-in form. */
export default function TaskDialog({
  courseId,
  taskId,
  onClose,
}: {
  courseId: string
  taskId: string | null
  onClose: () => void
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'en'
  const path = taskId ? endpoints.task(courseId, taskId) : null
  const task = useApi<TaskDetail>(path)
  const data = task.data
  const period = data && [data.start_date, data.end_date].filter(Boolean).map((date) => formatDate(date, language)).join(' – ')
  const score = data?.score != null ? (data.max_score ? `${data.score} / ${data.max_score}` : data.score) : null
  const record = data && {
    title: data.subject,
    meta: [data.task_type, period].filter(Boolean).join(' · '),
    attachments: data.attachments,
    body: data.body,
  }

  return (
    <RecordDialog
      open={taskId !== null}
      onClose={onClose}
      record={record}
      loading={task.loading}
      error={task.error}
      onRetry={task.reload}
      attachmentsLabel={t('tasks.attachments')}
      noTextLabel={t('tasks.noText')}
      before={
        data && (
          <KeyValueGrid
            items={[
              { label: t('tasks.method'), value: data.submission_method },
              { label: t('tasks.score'), value: score },
              { label: t('tasks.graded'), value: data.evaluation },
            ]}
          />
        )
      }
      after={
        data && (
          <>
            {data.links.length > 0 && (
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  {t('tasks.links')}
                </Typography>
                {data.links.map((link) => (
                  <Link key={link} href={link} target="_blank" rel="noopener noreferrer" sx={{ wordBreak: 'break-all' }}>
                    {link}
                  </Link>
                ))}
              </Stack>
            )}
            {data.can_submit && taskId && (
              <SubmitForm key={taskId} courseId={courseId} taskId={taskId} onSubmitted={task.reload} />
            )}
          </>
        )
      }
    />
  )
}

function SubmitForm({ courseId, taskId, onSubmitted }: { courseId: string; taskId: string; onSubmitted: () => void }) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const choose = (list: FileList | null) => {
    const chosen = Array.from(list ?? [])
    setDone(false)
    setFiles(chosen)
    if (chosen.length > 2) setError(t('tasks.tooMany'))
    else if (chosen.some((file) => file.size > MAX_FILE_BYTES)) setError(t('tasks.tooBig'))
    else setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData()
    form.append('file1', files[0])
    if (files[1]) form.append('file2', files[1])
    setBusy(true)
    setError(null)
    try {
      await apiPostForm<TaskDetail>(endpoints.taskSubmission(courseId, taskId), form)
      setFiles([])
      setDone(true)
      // The task reads differently once work is in, so drop the cached copy and load it again.
      onSubmitted()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('error.network'))
    } finally {
      setBusy(false)
    }
  }

  const canSubmit = !busy && files.length >= 1 && files.length <= 2 && files.every((file) => file.size <= MAX_FILE_BYTES)

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1.5}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {t('tasks.submitTitle')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('tasks.submitHint')}
        </Typography>
        <Box>
          <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />} disabled={busy}>
            {t('tasks.chooseFiles')}
            <input hidden type="file" multiple onChange={(event) => { choose(event.target.files); event.target.value = '' }} />
          </Button>
        </Box>
        {files.map((file) => (
          <Typography key={file.name} variant="body2" noWrap>
            {file.name}
          </Typography>
        ))}
        {error && <Alert severity="error">{error}</Alert>}
        {done && <Alert severity="success">{t('tasks.submitted')}</Alert>}
        <Box>
          <Button type="submit" variant="contained" disabled={!canSubmit}>
            {t('tasks.submit')}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
