import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { StoredPreset } from '../../../db/presets'

type DeletePresetDialogProps = {
  preset: StoredPreset | null
  onCancel: () => void
  onConfirm: () => void
}

export const DeletePresetDialog = ({ preset, onCancel, onConfirm }: DeletePresetDialogProps) => {
  const { t } = useTranslation()

  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (preset && !dialog.open) dialog.showModal()
    if (!preset && dialog.open) dialog.close()
  }, [preset])

  return createPortal(
    <dialog ref={dialogRef} className="modal" onClose={onCancel}>
      <div className="modal-box max-w-md bg-base-100">
        <h3 className="text-[15px] font-semibold text-error">{t('presets.deleteTitle')}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed opacity-70">
          {t('presets.deleteBody', { name: preset?.name ?? '' })}
        </p>
        <div className="modal-action">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-error btn-sm" onClick={onConfirm}>
            {t('presets.deleteConfirm')}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label={t('common.close')}>{t('common.close')}</button>
      </form>
    </dialog>,
    document.body,
  )
}
