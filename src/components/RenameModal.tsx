import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../contexts/AppStateContext'
import { useTemplates } from '../hooks/useTemplates'

// The target is looked up from the templates data (not carried in context), so only
// its id lives in the active-modal state.
export const RenameModal = () => {
  const { t } = useTranslation()
  const { activeModal, closeModal } = useAppState()
  const { templates, rename } = useTemplates()

  const template =
    activeModal?.type === 'rename'
      ? (templates.find((item) => item.id === activeModal.templateId) ?? null)
      : null

  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')

  // Seed the input from the target's current name when a rename opens (or switches to
  // a different template). Render-phase, so no effect and no empty first frame — and
  // it still seeds correctly if the templates query resolves after this mounts.
  const [seededId, setSeededId] = useState<string | null>(null)
  if (template && template.id !== seededId) {
    setSeededId(template.id)
    setName(template.name)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (template && !dialog.open) dialog.showModal()
    if (!template && dialog.open) dialog.close()
  }, [template])

  const save = async () => {
    const trimmed = name.trim()
    if (!trimmed || !template) return
    await rename(template.id, trimmed)
    closeModal()
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box bg-base-100">
        <h3 className="text-base font-semibold">{t('rename.title')}</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('rename.name')}</legend>
          <input
            className="input w-full"
            type="text"
            value={name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void save()
              }
            }}
          />
        </fieldset>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost btn-sm" onClick={closeModal}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!name.trim()}
            onClick={() => void save()}
          >
            {t('common.save')}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label={t('common.close')}>{t('common.close')}</button>
      </form>
    </dialog>
  )
}
