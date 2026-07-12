import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../contexts/AppStateContext'
import { useFieldValues } from '../contexts/FieldValuesContext'

export const ClearFieldsModal = () => {
  const { t } = useTranslation()
  const { activeModal, closeModal } = useAppState()
  const { reset } = useFieldValues()
  const open = activeModal?.type === 'clearFields'

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const confirm = () => {
    reset()
    closeModal()
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box bg-base-100">
        <h3 className="text-base font-semibold">{t('clear.title')}</h3>
        <p className="mt-1 text-sm leading-relaxed text-base-content/65">{t('clear.body')}</p>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost btn-sm" onClick={closeModal}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-error btn-sm" onClick={confirm}>
            {t('clear.confirm')}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label={t('common.close')}>{t('common.close')}</button>
      </form>
    </dialog>
  )
}
