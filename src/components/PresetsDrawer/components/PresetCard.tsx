import { Trans, useTranslation } from 'react-i18next'
import type { StoredPreset } from '../../../db/presets'
import { TrashIcon } from '../../icons'

const CHIP_LIMIT = 4

type PresetCardProps = {
  preset: StoredPreset
  sharedName: boolean
  onEdit: () => void
  onDelete: () => void
}

export const PresetCard = ({ preset, sharedName, onEdit, onDelete }: PresetCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2.5 rounded-box border border-base-300 bg-base-100 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{preset.name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs opacity-60">
            <span>
              <Trans
                i18nKey="presets.bindsTo"
                components={{
                  code: <code className="rounded bg-base-200 px-1 py-0.5 text-xs" />,
                }}
                values={{ key: preset.fieldKey }}
                shouldUnescape
                tOptions={{ interpolation: { escapeValue: true } }}
              />
            </span>
            {sharedName && (
              <span className="badge badge-warning badge-soft badge-xs font-medium">
                {t('presets.sharedName')}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" className="btn btn-ghost btn-xs" onClick={onEdit}>
            {t('presets.edit')}
          </button>
          <button
            type="button"
            className="btn btn-square btn-ghost btn-xs text-base-content/45 hover:bg-error/10 hover:text-error"
            aria-label={t('presets.deleteAria')}
            onClick={onDelete}
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>
      </div>
      {preset.options.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {preset.options.slice(0, CHIP_LIMIT).map((option) => (
            <span key={option} className="badge badge-ghost badge-sm text-xs font-normal">
              {option}
            </span>
          ))}
          {preset.options.length > CHIP_LIMIT && (
            <span className="badge badge-ghost badge-sm text-xs font-normal opacity-60">
              {t('presets.more', { count: preset.options.length - CHIP_LIMIT })}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs opacity-55">
        <span className="tabular-nums">
          {t('presets.optionCount', { count: preset.options.length })}
        </span>
        <span className="opacity-40">·</span>
        <span>{t(preset.allowManual ? 'presets.manualAllowed' : 'presets.listOnly')}</span>
      </div>
    </div>
  )
}
