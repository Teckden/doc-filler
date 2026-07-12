import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTemplates } from '../../../hooks/useTemplates'
import { parseDraftOptions, type PresetDraft } from '../draft'

const FIELD_KEYS_DATALIST_ID = 'preset-field-keys'

type PresetEditorViewProps = {
  draft: PresetDraft
  onPatch: (changes: Partial<PresetDraft>) => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
}

export const PresetEditorView = ({
  draft,
  onPatch,
  onCancel,
  onSave,
  onDelete,
}: PresetEditorViewProps) => {
  const { t } = useTranslation()
  const { templates } = useTemplates()

  const fieldSuggestions = useMemo(
    () => [...new Set(templates.flatMap((template) => template.fields))].sort(),
    [templates],
  )

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="text-[12px] font-semibold uppercase tracking-[0.1em] opacity-60">
          {t(draft.id ? 'presets.editTitle' : 'presets.newTitle')}
        </div>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('presets.name')}</legend>
          <input
            type="text"
            className="input w-full"
            value={draft.name}
            onChange={(event) => onPatch({ name: event.target.value })}
            placeholder={t('presets.namePlaceholder')}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('presets.fieldKey')}</legend>
          <input
            type="text"
            className="input w-full font-mono"
            value={draft.fieldKey}
            onChange={(event) => onPatch({ fieldKey: event.target.value })}
            placeholder={t('presets.fieldKeyPlaceholder')}
            list={FIELD_KEYS_DATALIST_ID}
          />
          <datalist id={FIELD_KEYS_DATALIST_ID}>
            {fieldSuggestions.map((field) => (
              <option key={field} value={field} />
            ))}
          </datalist>
          <p className="mt-1 text-[11.5px] leading-relaxed opacity-55">
            {t('presets.fieldKeyHelp')}
          </p>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend flex w-full items-center justify-between">
            <span>{t('presets.options')}</span>
            <span className="text-[10.5px] font-normal tabular-nums opacity-45">
              {t('presets.optionCount', { count: parseDraftOptions(draft.optionsText).length })}
            </span>
          </legend>
          <textarea
            className="textarea min-h-[150px] w-full font-mono leading-relaxed"
            value={draft.optionsText}
            onChange={(event) => onPatch({ optionsText: event.target.value })}
            placeholder={t('presets.optionsPlaceholder')}
          />
          <p className="mt-1 text-[11.5px] opacity-55">{t('presets.optionsHelp')}</p>
        </fieldset>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-base-300 bg-base-100 px-3 py-2.5">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={draft.allowManual}
            onChange={(event) => onPatch({ allowManual: event.target.checked })}
          />
          <span className="min-w-0">
            <span className="block text-[13.5px]">{t('presets.allowManual')}</span>
            <span className="block text-[11.5px] opacity-55">{t('presets.allowManualHelp')}</span>
          </span>
        </label>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-base-300 p-3">
        {draft.id && (
          <button
            type="button"
            className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            onClick={onDelete}
          >
            {t('presets.delete')}
          </button>
        )}
        <div className="flex-1" />
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onSave}
          disabled={draft.fieldKey.trim() === ''}
        >
          {t('presets.save')}
        </button>
      </div>
    </>
  )
}
