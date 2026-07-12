import { parse, stringify } from 'yaml'
import type { PresetInput, StoredPreset } from '../db/presets'

// The interchange format is YAML (chosen over JSON so users can hand-edit packs).
const PACK_KIND = 'docfiller-field-presets'
const PACK_VERSION = 1

export const serializePresetPack = (presets: StoredPreset[]): string =>
  stringify({
    kind: PACK_KIND,
    version: PACK_VERSION,
    presets: presets.map(({ name, fieldKey, allowManual, options }) => ({
      name,
      fieldKey,
      allowManual,
      options,
    })),
  })

// Accepts either a full pack document or a bare list of presets. Entries without
// a fieldKey are useless (they can never match a field) and are dropped. Throws
// on unparseable YAML; the caller surfaces the message.
export const parsePresetPack = (text: string, fallbackName: string): PresetInput[] => {
  const parsed: unknown = parse(text)
  const list = Array.isArray(parsed) ? parsed : (parsed as { presets?: unknown } | null)?.presets
  if (!Array.isArray(list)) return []
  return list.flatMap((raw): PresetInput[] => {
    if (typeof raw !== 'object' || raw === null) return []
    const entry = raw as Record<string, unknown>
    const fieldKey = typeof entry.fieldKey === 'string' ? entry.fieldKey.trim() : ''
    if (!fieldKey) return []
    const name =
      typeof entry.name === 'string' && entry.name.trim() ? entry.name.trim() : fallbackName
    const options = Array.isArray(entry.options)
      ? entry.options
          .filter((option): option is string => typeof option === 'string')
          .map((option) => option.trim())
          .filter(Boolean)
      : []
    return [{ name, fieldKey, allowManual: entry.allowManual !== false, options }]
  })
}
