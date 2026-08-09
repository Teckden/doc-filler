import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StoredTemplate } from '../../db/templates'
import { templateDisplayName } from '../../i18n/displayName'
import { useTemplates } from '../../hooks/useTemplates'
import { useAppState } from '../../contexts/AppStateContext'
import { PlusIcon, SearchIcon } from '../icons'
import { GroupHeader } from './components/GroupHeader'
import { TemplateRow } from './components/TemplateRow'

const SEARCH_MIN_TEMPLATES = 6
const UNGROUPED_KEY = 'ungrouped'

type TemplateListProps = {
  open: boolean
  onClose: () => void
}

export const TemplateList = ({ open, onClose }: TemplateListProps) => {
  const { t } = useTranslation()
  const {
    templates,
    groups,
    sections,
    activeTemplate,
    select,
    remove,
    assignToGroup,
    removeFromGroup,
    renameGroup,
  } = useTemplates()
  const { openModal, notify } = useAppState()

  const [query, setQuery] = useState('')
  const [collapsedKeys, setCollapsedKeys] = useState<string[]>([])
  const [chipOpenId, setChipOpenId] = useState<string | null>(null)
  const [renamingGroup, setRenamingGroup] = useState<string | null>(null)

  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (!open) {
      setQuery('')
      setChipOpenId(null)
      setRenamingGroup(null)
    }
  }

  const searchRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  const showSearch = templates.length >= SEARCH_MIN_TEMPLATES
  const search = showSearch ? query.trim().toLowerCase() : ''
  const visibleSections = search
    ? sections
        .map((section) => ({
          ...section,
          templates: section.templates.filter((template) =>
            templateDisplayName(template.name, t).toLowerCase().includes(search),
          ),
        }))
        .filter((section) => section.templates.length > 0)
    : sections
  const hasGroups = groups.length > 0

  const toggleCollapsed = (key: string) =>
    setCollapsedKeys((keys) =>
      keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key],
    )

  const handleDelete = async (template: StoredTemplate) => {
    await remove(template.id)
    notify(t('templates.deleted', { name: templateDisplayName(template.name, t) }))
  }

  return (
    <>
      {showSearch && (
        <li className="px-1 pt-2 pb-3 border-b border-base-300">
          <label className="input w-full bg-base-200 focus-within:outline-dashed!">
            <SearchIcon className="size-3.5 shrink-0 text-base-content/45" />
            <input
              ref={searchRef}
              type="text"
              className="grow"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('templates.searchPlaceholder', { count: templates.length })}
              aria-label={t('templates.searchPlaceholder', { count: templates.length })}
            />
          </label>
        </li>
      )}

      {visibleSections.map((section) => {
        const key = section.group === null ? UNGROUPED_KEY : `g:${section.group}`
        const headerless = section.group === null && !hasGroups
        const expanded = headerless || Boolean(search) || !collapsedKeys.includes(key)
        return (
          <Fragment key={key}>
            {!headerless && (
              <GroupHeader
                group={section.group}
                count={section.templates.length}
                expanded={expanded}
                renaming={section.group !== null && renamingGroup === section.group}
                onToggle={() => toggleCollapsed(key)}
                onStartRename={() => setRenamingGroup(section.group)}
                onCommitRename={(name) => {
                  if (section.group) void renameGroup(section.group, name)
                  setRenamingGroup(null)
                }}
                onCancelRename={() => setRenamingGroup(null)}
              />
            )}
            {expanded &&
              section.templates.map((template) => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  groups={groups}
                  isActive={template.id === activeTemplate?.id}
                  chipOpen={chipOpenId === template.id}
                  onToggleChip={() =>
                    setChipOpenId((current) => (current === template.id ? null : template.id))
                  }
                  onSelect={() => {
                    void select(template.id)
                    onClose()
                  }}
                  onRename={() => {
                    openModal({ type: 'rename', templateId: template.id })
                    onClose()
                  }}
                  onDelete={() => {
                    void handleDelete(template)
                    onClose()
                  }}
                  onAssign={(groupName) => {
                    void assignToGroup(template.id, groupName)
                    setChipOpenId(null)
                  }}
                  onRemoveFromGroup={() => {
                    void removeFromGroup(template.id)
                    setChipOpenId(null)
                  }}
                />
              ))}
          </Fragment>
        )
      })}

      {Boolean(search) && visibleSections.length === 0 && (
        <li className="px-2 py-5 text-center text-sm text-base-content/50">
          {t('templates.searchNoMatch')}
        </li>
      )}

      <li className="mt-1 border-t border-base-300 pt-1">
        <button
          type="button"
          className="btn btn-ghost btn-block justify-start gap-2 font-medium text-primary"
          onClick={() => {
            openModal({ type: 'upload' })
            onClose()
          }}
        >
          <PlusIcon className="size-4" />
          {t('templates.upload')}
        </button>
      </li>
    </>
  )
}
