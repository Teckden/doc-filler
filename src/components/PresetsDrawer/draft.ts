import type { StoredPreset } from '../../db/presets'

export interface PresetDraft {
  id: string | null
  name: string
  fieldKey: string
  allowManual: boolean
  optionsText: string
}

export const draftFromPreset = (preset: StoredPreset): PresetDraft => ({
  id: preset.id,
  name: preset.name,
  fieldKey: preset.fieldKey,
  allowManual: preset.allowManual,
  optionsText: preset.options.join('\n'),
})

export const emptyDraft = (): PresetDraft => ({
  id: null,
  name: '',
  fieldKey: '',
  allowManual: true,
  optionsText: '',
})

export const parseDraftOptions = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
