import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../contexts/AppStateContext'
import { useFieldValues } from '../contexts/FieldValuesContext'
import { setPresetChoice, updatePreset, type StoredPreset } from '../db/presets'
import { BookmarkIcon, PlusIcon } from './icons'

type PresetComboboxProps = {
  field: string
  matched: StoredPreset[]
  chosenId?: string
}

// A field whose name matches one or more presets: a button that opens a dropdown
// with the preset's options, a search/custom-value input (when the preset allows
// manual entry), and source chips when several presets bind to the same name.
export const PresetCombobox = ({ field, matched, chosenId }: PresetComboboxProps) => {
  const { t } = useTranslation()
  const { notify } = useAppState()
  const { values, setValue } = useFieldValues()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const value = values[field] ?? ''
  const hasValue = value !== ''
  const active = matched.find((preset) => preset.id === chosenId) ?? matched[0]
  const lowered = query.toLowerCase()
  const filtered = active.options.filter(
    (option) => !query || option.toLowerCase().includes(lowered),
  )
  const exactMatch = active.options.some((option) => option.toLowerCase() === lowered)
  const isCustomValue = hasValue && !active.options.includes(value)

  const close = () => {
    setOpen(false)
    setQuery('')
  }
  const commit = (next: string) => {
    setValue(field, next)
    close()
  }
  const commitAndAdd = async (next: string) => {
    await updatePreset(active.id, {
      name: active.name,
      fieldKey: active.fieldKey,
      allowManual: active.allowManual,
      options: [...active.options, next],
    })
    notify(t('presets.addedTo', { name: active.name }))
    commit(next)
  }

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        <span>{field}</span>
        <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10.5px] font-medium normal-case text-primary">
          <BookmarkIcon className="size-2.5" />
          {active.name}
        </span>
      </legend>

      <div className="relative">
        <button
          type="button"
          className={`input flex w-full items-center justify-between gap-2 text-left ${open ? 'border-primary ring-1 ring-primary/30' : ''}`}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span className={`truncate ${hasValue ? '' : 'opacity-45'}`}>
            {hasValue ? value : t('presets.selectPlaceholder')}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {isCustomValue && (
              <span className="badge badge-ghost badge-xs font-normal">{t('presets.custom')}</span>
            )}
            <span className="text-[10px] opacity-45">▼</span>
          </span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={close} />
            <div className="absolute top-full z-30 mt-1 flex w-full flex-col gap-1 rounded-box border border-base-300 bg-base-100 p-1.5 shadow-xl">
              {matched.length > 1 && (
                <div className="mb-0.5 border-b border-base-300 px-1 pb-1.5 pt-0.5">
                  <div className="mb-1 text-[10px] uppercase tracking-wider opacity-50">
                    {t('presets.pickOne', { count: matched.length })}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matched.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={`btn btn-xs ${preset.id === active.id ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                        onClick={() => void setPresetChoice(field, preset.id)}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {active.allowManual && (
                <input
                  type="text"
                  className="input input-sm w-full"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      if (query) commit(query)
                    } else if (event.key === 'Escape') {
                      close()
                    }
                  }}
                  placeholder={t('presets.searchPlaceholder')}
                  autoFocus
                />
              )}

              <div className="flex max-h-[200px] flex-col gap-0.5 overflow-y-auto pt-0.5">
                {filtered.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[13.5px] hover:bg-base-200 ${option === value ? 'bg-primary/10 font-medium text-primary' : ''}`}
                    onClick={() => commit(option)}
                  >
                    <span className="truncate">{option}</span>
                    {option === value && <span className="text-[13px] text-primary">✓</span>}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-2.5 py-2 text-[12.5px] opacity-45">{t('presets.noMatch')}</div>
                )}
              </div>

              {active.allowManual && query.trim() && !exactMatch && (
                <>
                  <button
                    type="button"
                    className="mt-0.5 break-words border-t border-base-300 px-2.5 py-2 text-left text-[13px] text-primary hover:bg-base-200"
                    onClick={() => commit(query.trim())}
                  >
                    {t('presets.useCustom', { value: query.trim() })}
                  </button>
                  <button
                    type="button"
                    className="flex items-start gap-1.5 rounded-md px-2.5 py-2 text-left text-base text-primary hover:bg-base-200"
                    onClick={() => void commitAndAdd(query.trim())}
                  >
                    <PlusIcon className="mt-0.5 size-3.5 shrink-0" />
                    <span className="min-w-0 break-words">
                      {t('presets.useAndAdd', { name: active.name })}
                    </span>
                  </button>
                </>
              )}

              {hasValue && (
                <button
                  type="button"
                  className="rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-error/80 hover:bg-error/10"
                  onClick={() => commit('')}
                >
                  {t('presets.clearValue')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </fieldset>
  )
}
