import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StoredTemplate } from '../../../db/templates'

type GroupAssignPanelProps = {
  template: StoredTemplate
  groups: string[]
  onAssign: (groupName: string) => void
  onRemove: () => void
  onClose: () => void
}

export const GroupAssignPanel = ({
  template,
  groups,
  onAssign,
  onRemove,
  onClose,
}: GroupAssignPanelProps) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const cleaned = query.trim()
  const lower = cleaned.toLowerCase()
  const options = lower ? groups.filter((group) => group.toLowerCase().includes(lower)) : groups
  const hasExact = groups.some((group) => group.toLowerCase() === lower)

  return (
    <li className="mx-1 mb-1.5 mt-0.5 flex flex-col gap-1 rounded-field border border-base-300 bg-base-200/60 p-1.5">
      <span className="px-1 text-xs uppercase tracking-wider text-base-content/45">
        {t('templates.groups.panelTitle')}
      </span>
      <input
        type="text"
        autoFocus
        className="input input-sm w-full"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('templates.groups.namePlaceholder')}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            if (cleaned) onAssign(cleaned)
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            onClose()
          }
        }}
      />
      {options.map((group) => (
        <button
          key={group}
          type="button"
          className={`cursor-pointer rounded-field px-2 py-1.5 text-left text-sm hover:bg-base-300/60 ${
            group === template.group ? 'bg-primary/10 font-medium text-primary' : ''
          }`}
          onClick={() => onAssign(group)}
        >
          {group}
        </button>
      ))}
      {cleaned && !hasExact && (
        <button
          type="button"
          className="cursor-pointer rounded-field px-2 py-1.5 text-left text-sm font-medium text-primary hover:bg-base-300/60"
          onClick={() => onAssign(cleaned)}
        >
          ＋ {t('templates.groups.create', { name: cleaned })}
        </button>
      )}
      {template.group && (
        <button
          type="button"
          className="mt-0.5 cursor-pointer rounded-field border-t border-base-300 px-2 py-1.5 text-left text-sm text-base-content/60 hover:bg-base-300/60"
          onClick={onRemove}
        >
          {t('templates.groups.remove')}
        </button>
      )}
    </li>
  )
}
