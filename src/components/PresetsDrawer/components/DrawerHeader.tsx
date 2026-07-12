import { useTranslation } from 'react-i18next'
import { BookmarkIcon } from '../../icons'

export const DrawerHeader = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-base-300 px-4">
      <BookmarkIcon className="size-4.5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-tight">{t('presets.title')}</div>
        <div className="text-[11px] leading-tight opacity-55">{t('presets.subtitle')}</div>
      </div>
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
