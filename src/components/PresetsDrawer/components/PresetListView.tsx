import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeFieldKey, type StoredPreset } from '../../../db/presets'
import { usePresetPack } from '../hooks/usePresetPack'
import { PresetCard } from './PresetCard'
import { DownloadIcon, PlusIcon, UploadIcon } from '../../icons'

type PresetListViewProps = {
  presets: StoredPreset[]
  loading: boolean
  onNew: () => void
  onEdit: (preset: StoredPreset) => void
  onDelete: (presetId: string) => void
}

export const PresetListView = ({
  presets,
  loading,
  onNew,
  onEdit,
  onDelete,
}: PresetListViewProps) => {
  const { t } = useTranslation()
  const { exportPack, importPack } = usePresetPack(presets)

  const keyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const preset of presets) {
      const key = normalizeFieldKey(preset.fieldKey)
      counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
  }, [presets])

  return (
    <>
      <div className="flex h-12 shrink-0 items-center gap-1.5 border-b border-base-300 px-3">
        <button type="button" className="btn btn-primary btn-sm gap-1.5" onClick={onNew}>
          <PlusIcon className="size-3.5" />
          {t('presets.new')}
        </button>
        <div className="flex-1" />
        <label
          className="btn btn-ghost btn-sm cursor-pointer gap-1.5"
          title={t('presets.importTitle')}
        >
          <UploadIcon className="size-3.5" />
          <span className="hidden sm:inline">{t('presets.import')}</span>
          <input
            type="file"
            accept=".yaml,.yml,.json,text/yaml,application/json"
            className="hidden"
            onChange={(event) => void importPack(event)}
          />
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-1.5"
          title={t('presets.exportTitle')}
          onClick={exportPack}
          disabled={presets.length === 0}
        >
          <DownloadIcon className="size-3.5" />
          <span className="hidden sm:inline">{t('presets.export')}</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {!loading && presets.length === 0 && (
          <p className="px-1 py-2 text-sm leading-relaxed opacity-55">{t('presets.empty')}</p>
        )}
        {presets.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            sharedName={(keyCounts[normalizeFieldKey(preset.fieldKey)] ?? 0) > 1}
            onEdit={() => onEdit(preset)}
            onDelete={() => onDelete(preset.id)}
          />
        ))}
      </div>
    </>
  )
}
