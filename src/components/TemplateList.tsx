import { useTranslation } from 'react-i18next'
import type { StoredTemplate } from '../db/templates'
import { templateDisplayName } from '../i18n/displayName'
import { useTemplates } from '../hooks/useTemplates'
import { useAppState } from '../contexts/AppStateContext'
import { PencilIcon, PlusIcon, TrashIcon } from './icons'

const closeDropdown = () => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}

export const TemplateList = () => {
  const { t } = useTranslation()
  const { templates, activeTemplate, select, remove } = useTemplates()
  const { openModal, notify } = useAppState()

  const handleDelete = async (template: StoredTemplate) => {
    await remove(template.id)
    notify(t('templates.deleted', { name: templateDisplayName(template.name, t) }))
  }

  return (
    <>
      {templates.map((template) => {
        const isActive = template.id === activeTemplate?.id
        const name = templateDisplayName(template.name, t)
        return (
          <li
            key={template.id}
            className={`list-row items-center rounded-field py-2 ${isActive ? 'bg-primary/10' : ''}`}
          >
            <div
              className="tooltip tooltip-bottom list-col-grow before:max-w-[15rem] before:whitespace-normal before:break-words"
              data-tip={name}
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
              className="btn btn-square btn-ghost btn-sm text-base-content/55 hover:text-base-content"
              aria-label={t('templates.rename', { name })}
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
              aria-label={t('templates.delete', { name })}
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
          {t('templates.upload')}
        </button>
      </li>
    </>
  )
}
