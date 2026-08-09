import { useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  addTemplate,
  deleteTemplate,
  renameTemplate,
  listTemplates,
  assignTemplateToGroup,
  removeTemplateFromGroup,
  renameTemplateGroup,
  getActiveTemplateId,
  setActiveTemplateId,
  type StoredTemplate,
} from '../db/templates'

export interface TemplateGroupSection {
  group: string | null
  templates: StoredTemplate[]
}

export interface UseTemplates {
  templates: StoredTemplate[]
  groups: string[]
  sections: TemplateGroupSection[]
  activeTemplate: StoredTemplate | null
  loading: boolean
  add: (file: File) => Promise<StoredTemplate>
  remove: (id: string) => Promise<void>
  rename: (id: string, name: string) => Promise<void>
  select: (id: string) => Promise<void>
  assignToGroup: (templateId: string, groupName: string) => Promise<void>
  removeFromGroup: (templateId: string) => Promise<void>
  renameGroup: (oldName: string, newName: string) => Promise<void>
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

  const groups = useMemo(() => {
    const names: string[] = []
    for (const template of templates) {
      if (template.group && !names.includes(template.group)) names.push(template.group)
    }
    return names.sort((a, b) => a.localeCompare(b))
  }, [templates])

  const sections = useMemo<TemplateGroupSection[]>(() => {
    const grouped: TemplateGroupSection[] = groups.map((group) => ({
      group,
      templates: templates.filter((template) => template.group === group),
    }))
    const ungrouped = templates.filter((template) => !template.group)
    return ungrouped.length > 0 ? [...grouped, { group: null, templates: ungrouped }] : grouped
  }, [templates, groups])

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
    groups,
    sections,
    activeTemplate,
    loading,
    add,
    remove,
    rename,
    select,
    assignToGroup: assignTemplateToGroup,
    removeFromGroup: removeTemplateFromGroup,
    renameGroup: renameTemplateGroup,
  }
}
