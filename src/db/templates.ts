import Dexie, { type Table } from 'dexie'
import { extractFields } from '../lib/docx'

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

const ACTIVE_ID_KEY = 'activeTemplateId'

class DocFillerDB extends Dexie {
  templates!: Table<StoredTemplate, string>
  meta!: Table<MetaRow, string>

  constructor() {
    super('docfiller')
    // Schema v1 — define both tables up front so adding metadata later needs no
    // version bump/migration.
    this.version(1).stores({
      templates: 'id, createdAt, name',
      meta: 'key',
    })
  }
}

export const db = new DocFillerDB()

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

export const deleteTemplate = async (id: string): Promise<void> => {
  await db.templates.delete(id)
}

export const getActiveTemplateId = async (): Promise<string | undefined> =>
  (await db.meta.get(ACTIVE_ID_KEY))?.value

export const setActiveTemplateId = async (id: string): Promise<void> => {
  await db.meta.put({ key: ACTIVE_ID_KEY, value: id })
}
