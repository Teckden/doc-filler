import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../../contexts/AppStateContext'
import { addPreset, updatePreset, type PresetInput, type StoredPreset } from '../../../db/presets'
import { draftFromPreset, emptyDraft, parseDraftOptions, type PresetDraft } from '../draft'

export interface UsePresetDraft {
  draft: PresetDraft | null
  startNew: () => void
  startEdit: (preset: StoredPreset) => void
  patch: (changes: Partial<PresetDraft>) => void
  cancel: () => void
  save: () => Promise<void>
}

export const usePresetDraft = (): UsePresetDraft => {
  const { t } = useTranslation()
  const { notify } = useAppState()

  const [draft, setDraft] = useState<PresetDraft | null>(null)

  const save = async () => {
    if (!draft) return
    const input: PresetInput = {
      name: draft.name.trim() || t('presets.untitled'),
      fieldKey: draft.fieldKey.trim(),
      allowManual: draft.allowManual,
      options: parseDraftOptions(draft.optionsText),
    }
    if (draft.id) await updatePreset(draft.id, input)
    else await addPreset(input)
    setDraft(null)
    notify(t('presets.saved'))
  }

  return {
    draft,
    startNew: () => setDraft(emptyDraft()),
    startEdit: (preset: StoredPreset) => setDraft(draftFromPreset(preset)),
    patch: (changes: Partial<PresetDraft>) =>
      setDraft((prev) => (prev ? { ...prev, ...changes } : prev)),
    cancel: () => setDraft(null),
    save,
  }
}
