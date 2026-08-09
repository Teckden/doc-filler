import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon, ChevronDownIcon, PencilIcon, XMarkIcon } from '../../icons'

type GroupRenameFormProps = {
  initialName: string
  onCommit: (name: string) => void
  onCancel: () => void
}

const GroupRenameForm = ({ initialName, onCommit, onCancel }: GroupRenameFormProps) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(initialName)

  return (
    <li className="mt-1 flex items-center gap-1 px-2 py-1">
      <input
        type="text"
        autoFocus
        className="input input-xs min-w-0 flex-1 text-xs font-semibold uppercase tracking-wider"
        aria-label={t('templates.groups.rename', { name: initialName })}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onCommit(draft)
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            onCancel()
          }
        }}
      />
      <button
        type="button"
        className="btn btn-square btn-ghost btn-xs text-success"
        aria-label={t('common.save')}
        onClick={() => onCommit(draft)}
      >
        <CheckIcon className="size-3.5" />
      </button>
      <button
        type="button"
        className="btn btn-square btn-ghost btn-xs text-base-content/55"
        aria-label={t('common.cancel')}
        onClick={onCancel}
      >
        <XMarkIcon className="size-3.5" />
      </button>
    </li>
  )
}

type GroupHeaderProps = {
  group: string | null
  count: number
  expanded: boolean
  renaming: boolean
  onToggle: () => void
  onStartRename: () => void
  onCommitRename: (name: string) => void
  onCancelRename: () => void
}

export const GroupHeader = ({
  group,
  count,
  expanded,
  renaming,
  onToggle,
  onStartRename,
  onCommitRename,
  onCancelRename,
}: GroupHeaderProps) => {
  const { t } = useTranslation()
  const name = group ?? t('templates.groups.ungrouped')

  if (renaming) {
    return (
      <GroupRenameForm
        initialName={group ?? ''}
        onCommit={onCommitRename}
        onCancel={onCancelRename}
      />
    )
  }

  return (
    <li className="mt-1 flex items-center gap-0.5 px-2 py-1">
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 py-0.5 text-left"
        aria-expanded={expanded}
        aria-label={t(expanded ? 'templates.groups.collapse' : 'templates.groups.expand', { name })}
        onClick={onToggle}
      >
        <ChevronDownIcon
          className={`size-3 shrink-0 text-base-content/45 transition-transform ${expanded ? '' : '-rotate-90'}`}
        />
        <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wider text-base-content/60">
          {name}
        </span>
        <span className="text-xs tabular-nums text-base-content/40">{count}</span>
      </button>
      {group !== null && (
        <button
          type="button"
          className="btn btn-square btn-ghost btn-xs text-base-content/45 hover:text-base-content"
          aria-label={t('templates.groups.rename', { name })}
          onClick={onStartRename}
        >
          <PencilIcon className="size-3.5" />
        </button>
      )}
    </li>
  )
}
