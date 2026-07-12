import { useTranslation } from 'react-i18next'
import { useAppState } from '../../../contexts/AppStateContext'
import { BookmarkIcon, QuestionIcon } from '../../icons'

export const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const { openModal } = useAppState()

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-base-300 px-4">
      <BookmarkIcon className="size-4.5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-tight">{t('presets.title')}</div>
        <div className="text-[11px] leading-tight opacity-55">{t('presets.subtitle')}</div>
      </div>
      <button
        type="button"
        className="btn btn-square btn-ghost btn-sm text-base-content/70 hover:text-primary"
        aria-label={t('presetsHelp.title')}
        title={t('presetsHelp.title')}
        onClick={() => openModal({ type: 'presetsHelp' })}
      >
        <QuestionIcon className="size-4.5" />
      </button>
      <button
        type="button"
        className="btn btn-square btn-ghost btn-sm"
        aria-label={t('common.close')}
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  )
}
