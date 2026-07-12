import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { UploadIcon } from './icons'
import { templateDisplayName } from '../i18n/displayName'
import { useAppState } from '../contexts/AppStateContext'
import { useTemplates } from '../hooks/useTemplates'

const transComponents = {
  code: <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs" />,
  b: <span className="font-medium" />,
}

export const UploadModal = () => {
  const { t } = useTranslation()
  const { activeModal, closeModal, notify } = useAppState()
  const { add } = useTemplates()
  const open = activeModal?.type === 'upload'

  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  // Parse/validation errors stay local so the modal stays open for a retry.
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const reset = () => {
    setFile(null)
    setDragOver(false)
    setError(null)
    setBusy(false)
    // Clear the input's DOM value too, or re-picking the same file fires no change.
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const pickFile = (candidate: File | null | undefined) => {
    if (!candidate) return
    if (!candidate.name.toLowerCase().endsWith('.docx')) {
      setError(t('upload.invalidType'))
      setFile(null)
      return
    }
    setError(null)
    setFile(candidate)
  }

  const handleAdd = async () => {
    if (!file) return
    setBusy(true)
    try {
      const record = await add(file)
      const count = record.fields.length
      notify(t('upload.added', { name: templateDisplayName(record.name, t), count }))
      reset()
      closeModal()
    } catch (err) {
      setError(
        err instanceof Error
          ? t('upload.parseError', { message: err.message })
          : t('upload.parseErrorGeneric'),
      )
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={() => {
        reset()
        closeModal()
      }}
    >
      <div className="modal-box bg-base-100">
        <h3 className="text-base font-semibold">{t('upload.title')}</h3>
        <p className="mt-1 text-sm leading-relaxed text-base-content/65">
          <Trans
            i18nKey="upload.body"
            components={transComponents}
            values={{ token: '{{placeholders}}' }}
          />
        </p>

        <label
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-box border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/60'
          }`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragOver(false)
            pickFile(event.dataTransfer.files?.[0])
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            className="sr-only"
            onChange={(event) => pickFile(event.target.files?.[0])}
            aria-label={t('upload.choose')}
          />
          <UploadIcon className="size-7 text-base-content/45" />
          {file ? (
            <span className="text-sm font-medium">{file.name}</span>
          ) : (
            <span className="text-sm text-base-content/65">
              <Trans i18nKey="upload.dropzone" components={transComponents} />
            </span>
          )}
        </label>

        {error && (
          <div role="alert" className="alert alert-error mt-3">
            <span>{error}</span>
          </div>
        )}

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              reset()
              closeModal()
            }}
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm gap-1.5"
            disabled={!file || busy}
            onClick={handleAdd}
          >
            {busy && <span className="loading loading-spinner loading-xs"></span>}
            {t('upload.add')}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label={t('common.close')}>{t('common.close')}</button>
      </form>
    </dialog>
  )
}
