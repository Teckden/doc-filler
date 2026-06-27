import type { StoredTemplate } from '../db/templates'
import { useTemplates } from '../hooks/useTemplates'
import { useAppState } from '../contexts/AppStateContext'
import { PencilIcon, PlusIcon, TrashIcon } from './icons'

const fieldCount = (n: number) => `${n} field${n === 1 ? '' : 's'}`

const closeDropdown = () => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}

export const TemplateList = () => {
  const { templates, activeTemplate, select, remove } = useTemplates()
  const { openModal, notify } = useAppState()

  const handleDelete = async (template: StoredTemplate) => {
    await remove(template.id)
    notify(`Deleted “${template.name}”`)
  }

  return (
    <>
      {templates.map((template) => {
        const isActive = template.id === activeTemplate?.id
        return (
          <li
            key={template.id}
            className={`list-row items-center rounded-field py-2 ${isActive ? 'bg-primary/10' : ''}`}
          >
            <div
              className="tooltip tooltip-bottom list-col-grow before:max-w-[15rem] before:whitespace-normal before:break-words"
              data-tip={template.name}
            >
              <button
                type="button"
                className="block w-full cursor-pointer text-left leading-tight"
                onClick={() => {
                  select(template.id)
                  closeDropdown()
                }}
              >
                <div
                  className={`line-clamp-2 break-words text-[13px] ${isActive ? 'font-semibold text-primary' : 'font-medium'}`}
                >
                  {template.name}
                </div>
                <div className="text-[10px] text-base-content/55">
                  {fieldCount(template.fields.length)}
                </div>
              </button>
            </div>
            <button
              type="button"
              className="btn btn-square btn-ghost btn-sm text-base-content/55 hover:text-base-content"
              aria-label={`Rename ${template.name}`}
              onClick={(event) => {
                event.stopPropagation()
                openModal({ type: 'rename', templateId: template.id })
                closeDropdown()
              }}
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              type="button"
              className="btn btn-square btn-ghost btn-sm text-base-content/55 hover:text-error"
              aria-label={`Delete ${template.name}`}
              onClick={(event) => {
                event.stopPropagation()
                handleDelete(template)
                closeDropdown()
              }}
            >
              <TrashIcon className="size-4" />
            </button>
          </li>
        )
      })}

      <li className="mt-1 border-t border-base-300 pt-1">
        <button
          type="button"
          className="btn btn-ghost btn-block justify-start gap-2 font-medium text-primary"
          onClick={() => {
            openModal({ type: 'upload' })
            closeDropdown()
          }}
        >
          <PlusIcon className="size-4" />
          Upload template
        </button>
      </li>
    </>
  )
}
