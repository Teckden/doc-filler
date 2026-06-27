import { useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  addTemplate,
  deleteTemplate,
  renameTemplate,
  listTemplates,
  getActiveTemplateId,
  setActiveTemplateId,
  type StoredTemplate,
} from '../db/templates'

export interface UseTemplates {
  templates: StoredTemplate[]
  activeTemplate: StoredTemplate | null
  loading: boolean
  add: (file: File) => Promise<StoredTemplate>
  remove: (id: string) => Promise<void>
  rename: (id: string, name: string) => Promise<void>
  select: (id: string) => Promise<void>
}

// Reactive view over the templates table plus the persisted active-template id.
// All IndexedDB access lives in db/templates.ts; this hook only orchestrates
// reactivity, active-id resolution, and integrity (a stored id that no longer
// exists falls back to the most recent template, or none).
export const useTemplates = (): UseTemplates => {
  // Read the templates list and the active id in ONE liveQuery so both arrive in
  // the same render. Separate queries could resolve out of order, making the
  // active id read as null before its row loads and letting the integrity effect
  // clobber the persisted selection.
  const data = useLiveQuery(() => Promise.all([listTemplates(), getActiveTemplateId()]))

  const loading = data === undefined
  const templates = useMemo(() => data?.[0] ?? [], [data])
  const storedActiveId = data?.[1] ?? null

  const activeTemplate = useMemo<StoredTemplate | null>(() => {
    if (templates.length === 0) return null
    return templates.find((template) => template.id === storedActiveId) ?? templates[0]
  }, [templates, storedActiveId])

  // Persist a corrected active id when the stored one is stale (deleted) or unset
  // but templates exist. Keeps the restored-on-refresh id valid against the DB.
  useEffect(() => {
    if (loading || !activeTemplate) return
    if (activeTemplate.id !== storedActiveId) {
      void setActiveTemplateId(activeTemplate.id)
    }
  }, [loading, activeTemplate, storedActiveId])

  const add = async (file: File) => {
    const record = await addTemplate(file)
    await setActiveTemplateId(record.id)
    return record
  }

  // After deletion the templates liveQuery refires; activeTemplate recomputes to
  // the most recent survivor (or null) and the effect above repersists it.
  const remove = (id: string) => deleteTemplate(id)

  const rename = (id: string, name: string) => renameTemplate(id, name)

  const select = (id: string) => setActiveTemplateId(id)

  return {
    templates,
    activeTemplate,
    loading,
    add,
    remove,
    rename,
    select,
  }
}
