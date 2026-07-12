import { db } from './templates'

// A reusable option list bound to a field name. Any template field whose name
// matches `fieldKey` (case-insensitively) renders as a combobox fed by `options`.
export interface StoredPreset {
  id: string
  name: string
  fieldKey: string
  allowManual: boolean
  options: string[]
  createdAt: number
  updatedAt: number
}

// When several presets bind to the same field name, the user's pick of which one
// feeds the field. Keyed by normalized field name so the choice is global, not
// per template.
export interface StoredPresetChoice {
  fieldKey: string
  presetId: string
}

export interface PresetInput {
  name: string
  fieldKey: string
  allowManual: boolean
  options: string[]
}

export const normalizeFieldKey = (key: string): string => key.trim().toLowerCase()

export const matchingPresets = (presets: StoredPreset[], field: string): StoredPreset[] => {
  const normalized = normalizeFieldKey(field)
  return presets.filter((preset) => normalizeFieldKey(preset.fieldKey) === normalized)
}

export const listPresets = (): Promise<StoredPreset[]> => db.presets.orderBy('createdAt').toArray()

export const listPresetChoices = (): Promise<StoredPresetChoice[]> => db.presetChoices.toArray()

export const addPreset = async (input: PresetInput): Promise<StoredPreset> => {
  const now = Date.now()
  const record: StoredPreset = { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now }
  await db.presets.add(record)
  return record
}

export const updatePreset = async (id: string, input: PresetInput): Promise<void> => {
  await db.presets.update(id, { ...input, updatedAt: Date.now() })
}

// Cascade-deletes the choices pointing at the preset so a stale choice can't
// resurrect it as "chosen" if a preset with the same id is ever re-imported.
export const deletePreset = async (id: string): Promise<void> => {
  await db.transaction('rw', db.presets, db.presetChoices, async () => {
    await db.presets.delete(id)
    await db.presetChoices.where('presetId').equals(id).delete()
  })
}

export const setPresetChoice = async (fieldKey: string, presetId: string): Promise<void> => {
  await db.presetChoices.put({ fieldKey: normalizeFieldKey(fieldKey), presetId })
}

// Merges a preset pack: an entry matching an existing preset by name + fieldKey
// (case-insensitive) overwrites it in place, anything else is appended.
export const importPresets = async (
  entries: PresetInput[],
): Promise<{ added: number; updated: number }> => {
  let added = 0
  let updated = 0
  await db.transaction('rw', db.presets, async () => {
    const existing = await db.presets.toArray()
    const idByKey = new Map(
      existing.map((preset) => [`${preset.name}|${preset.fieldKey}`.toLowerCase(), preset.id]),
    )
    const now = Date.now()
    for (const entry of entries) {
      const key = `${entry.name}|${entry.fieldKey}`.toLowerCase()
      const id = idByKey.get(key)
      if (id) {
        await db.presets.update(id, { ...entry, updatedAt: now })
        updated++
      } else {
        const record: StoredPreset = {
          id: crypto.randomUUID(),
          ...entry,
          createdAt: now,
          updatedAt: now,
        }
        await db.presets.add(record)
        idByKey.set(key, record.id)
        added++
      }
    }
  })
  return { added, updated }
}
