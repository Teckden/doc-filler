import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { listPresets, listPresetChoices, type StoredPreset } from '../db/presets'

export interface UsePresets {
  presets: StoredPreset[]
  loading: boolean
  // Normalized field name -> chosen preset id, for fields several presets bind to.
  choices: Record<string, string>
}

export const usePresets = (): UsePresets => {
  const presetRows = useLiveQuery(listPresets)
  const choiceRows = useLiveQuery(listPresetChoices)

  const presets = useMemo(() => presetRows ?? [], [presetRows])
  const choices = useMemo(
    () => Object.fromEntries((choiceRows ?? []).map((row) => [row.fieldKey, row.presetId])),
    [choiceRows],
  )

  return { presets, loading: presetRows === undefined, choices }
}
