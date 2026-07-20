import Dexie, { type Table } from 'dexie'
import { extractFields } from '../lib/docx'
// Type-only import: presets.ts imports `db` from here at runtime, so the cycle stays compile-time only.
import type { StoredPreset, StoredPresetChoice } from './presets'
import {
  initialServiceRecord,
  SERVICE_RECORD_KEY,
  type ServiceRecordI,
} from '../models/ServiceRecord'

// A template the user uploaded, stored verbatim in IndexedDB. The raw .docx is
// kept as a Blob (never base64) and re-fed to docx-templates at export time via
// `blob.arrayBuffer()`. `fields` is extracted once at upload so switching
// templates never re-parses the document.
export interface StoredTemplate {
  id: string
  name: string
  blob: Blob
  fields: string[]
  createdAt: number
  updatedAt: number
}

// Tiny key/value table for app metadata (currently just the active template id).
// Living in the same DB keeps all persistence in one place and reactive.
interface MetaRow {
  key: string
  value: string
}

// Per-template field answers, keyed by templateId (one row per template). Kept in
// its own table rather than on StoredTemplate so switching/listing templates
// never drags the answer maps around, and a template's answers cascade-delete
// with it.
export interface StoredFieldValues {
  templateId: string
  values: Record<string, string>
  updatedAt: number
}

const ACTIVE_ID_KEY = 'activeTemplateId'

class DocFillerDB extends Dexie {
  templates!: Table<StoredTemplate, string>
  meta!: Table<MetaRow, string>
  fieldValues!: Table<StoredFieldValues, string>
  presets!: Table<StoredPreset, string>
  presetChoices!: Table<StoredPresetChoice, string>
  serviceRecord!: Table<ServiceRecordI, string>

  constructor() {
    super('docfiller')
    // Schema v1 — define both tables up front so adding metadata later needs no
    // version bump/migration.
    this.version(1).stores({
      templates: 'id, createdAt, name',
      meta: 'key',
    })
    // Schema v2 — purely additive. Dexie carries v1 tables forward unchanged; we
    // only declare the new fieldValues table. Existing template/meta data stays
    // intact with no migration logic.
    this.version(2).stores({
      fieldValues: 'templateId',
    })
    // Schema v3 — additive again: the field-preset library and the per-field
    // choice of which preset feeds a field when several bind to the same name.
    this.version(3).stores({
      presets: 'id, fieldKey, createdAt',
      presetChoices: 'fieldKey, presetId',
    })
    this.version(4).stores({
      serviceRecord: '',
    })
  }
}

export const db = new DocFillerDB()

db.on('populate', (tx) => {
  void tx.table('serviceRecord').add(initialServiceRecord, SERVICE_RECORD_KEY)
})

const stripExtension = (fileName: string): string => fileName.replace(/\.docx$/i, '')

// Reads the file once, extracts its fields, and persists the record. Throws if
// the file isn't a parseable .docx (the caller surfaces the message).
export const addTemplate = async (file: File): Promise<StoredTemplate> => {
  const buffer = await file.arrayBuffer()
  const fields = await extractFields(buffer)
  const now = Date.now()
  const record: StoredTemplate = {
    id: crypto.randomUUID(),
    name: stripExtension(file.name),
    blob: new Blob([buffer], { type: file.type }),
    fields,
    createdAt: now,
    updatedAt: now,
  }
  await db.templates.add(record)
  return record
}

// Newest first, so the switcher lists recent uploads on top and a deleted
// active template can fall back to listTemplates()[0] as "the most recent".
export const listTemplates = (): Promise<StoredTemplate[]> =>
  db.templates.orderBy('createdAt').reverse().toArray()

export const getTemplate = (id: string): Promise<StoredTemplate | undefined> => db.templates.get(id)

export const renameTemplate = async (id: string, name: string): Promise<void> => {
  const cleaned = stripExtension(name).trim()
  await db.templates.update(id, { name: cleaned, updatedAt: Date.now() })
}

// Cascade-deletes the template and its field values in one transaction so a
// crash mid-delete can't leave an orphaned answer row behind.
export const deleteTemplate = async (id: string): Promise<void> => {
  await db.transaction('rw', db.templates, db.fieldValues, async () => {
    await db.templates.delete(id)
    await db.fieldValues.delete(id)
  })
}

export const getFieldValues = async (templateId: string): Promise<Record<string, string>> =>
  (await db.fieldValues.get(templateId))?.values ?? {}

export const saveFieldValues = async (
  templateId: string,
  values: Record<string, string>,
): Promise<void> => {
  await db.fieldValues.put({ templateId, values, updatedAt: Date.now() })
}

export const deleteFieldValues = async (templateId: string): Promise<void> => {
  await db.fieldValues.delete(templateId)
}

export const getActiveTemplateId = async (): Promise<string | undefined> =>
  (await db.meta.get(ACTIVE_ID_KEY))?.value

export const setActiveTemplateId = async (id: string): Promise<void> => {
  await db.meta.put({ key: ACTIVE_ID_KEY, value: id })
}
