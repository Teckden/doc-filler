import { useTranslation } from 'react-i18next'
import type { StoredTemplate } from '../../../db/templates'
import { templateDisplayName } from '../../../i18n/displayName'
import { PencilIcon, PlusIcon, TrashIcon } from '../../icons'
import { GroupAssignPanel } from './GroupAssignPanel'

type TemplateRowProps = {
  template: StoredTemplate
  groups: string[]
  isActive: boolean
  chipOpen: boolean
  onToggleChip: () => void
  onSelect: () => void
  onRename: () => void
  onDelete: () => void
  onAssign: (groupName: string) => void
  onRemoveFromGroup: () => void
}

export const TemplateRow = ({
  template,
  groups,
  isActive,
  chipOpen,
  onToggleChip,
  onSelect,
  onRename,
  onDelete,
  onAssign,
  onRemoveFromGroup,
}: TemplateRowProps) => {
  const { t } = useTranslation()
  const name = templateDisplayName(template.name, t)

  return (
    <>
      <li
        className={`list-row gap-1 items-center rounded-field py-2 ${isActive ? 'bg-primary/10' : ''}`}
      >
        <div
          className="tooltip tooltip-bottom list-col-grow before:max-w-[15rem] before:whitespace-normal before:break-words"
          data-tip={name}
        >
          <button
            type="button"
            className="block w-full cursor-pointer text-left leading-tight"
            onClick={onSelect}
          >
            <div
              className={`line-clamp-2 break-words text-sm ${isActive ? 'font-semibold text-primary' : 'font-medium'}`}
            >
              {name}
            </div>
            <div className="text-xs text-base-content/55">
              {t('templates.fieldCount', { count: template.fields.length })}
            </div>
          </button>
        </div>
        <button
          type="button"
          className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs ${
            chipOpen
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-base-300 text-base-content/60 hover:text-base-content'
          }`}
          aria-label={t('templates.groups.chipAria', { name })}
          aria-expanded={chipOpen}
          onClick={(event) => {
            event.stopPropagation()
            onToggleChip()
          }}
        >
          {template.group ? <PencilIcon className="size-3" /> : <PlusIcon className="size-3" />}
          {t('templates.groups.chip')}
        </button>
        <button
          type="button"
          className="btn btn-square btn-ghost btn-sm text-base-content/55 hover:text-base-content"
          aria-label={t('templates.rename', { name })}
          onClick={(event) => {
            event.stopPropagation()
            onRename()
          }}
        >
          <PencilIcon className="size-4" />
        </button>
        <button
          type="button"
          className="btn btn-square btn-ghost btn-sm text-base-content/55 hover:text-error"
          aria-label={t('templates.delete', { name })}
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
        >
          <TrashIcon className="size-4" />
        </button>
      </li>
      {chipOpen && (
        <GroupAssignPanel
          template={template}
          groups={groups}
          onAssign={onAssign}
          onRemove={onRemoveFromGroup}
          onClose={onToggleChip}
        />
      )}
    </>
  )
}
