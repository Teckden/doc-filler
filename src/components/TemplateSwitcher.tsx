import { useRef, useState, type CSSProperties, type ToggleEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { templateDisplayName } from '../i18n/displayName'
import { useTemplates } from '../hooks/useTemplates'
import { TemplateList } from './TemplateList'
import { ChevronDownIcon } from './icons'

export const TemplateSwitcher = () => {
  const { t } = useTranslation()
  const { activeTemplate } = useTemplates()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLUListElement>(null)

  if (!activeTemplate) return null

  const name = templateDisplayName(activeTemplate.name, t)
  const showTooltip = name.length > 22

  return (
    <>
      <button
        type="button"
        popoverTarget="template-menu"
        style={{ anchorName: '--template-menu' } as CSSProperties}
        className={
          showTooltip
            ? 'btn btn-ghost h-auto min-h-0 w-56 flex-nowrap gap-2 px-2 py-1.5 font-normal tooltip tooltip-bottom before:max-w-[15rem] before:whitespace-normal before:break-words'
            : 'btn btn-ghost h-auto min-h-0 w-56 flex-nowrap gap-2 px-2 py-1.5 font-normal'
        }
        data-tip={showTooltip ? name : undefined}
        aria-label={t('templates.switch', { name })}
        aria-expanded={open}
      >
        {/* Fixed-width trigger: the name column fills and truncates so a long title
            never stretches the navbar; the chevron stays pinned to the right. */}
        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          <span className="w-full truncate text-left text-sm font-semibold">{name}</span>
          <span className="w-full truncate text-left text-xs text-base-content/55">
            {t('templates.fieldCount', { count: activeTemplate.fields.length })}
          </span>
        </span>
        <ChevronDownIcon className="size-3.5 shrink-0 text-base-content/55" />
      </button>

      <ul
        ref={popoverRef}
        popover=""
        id="template-menu"
        style={{ positionAnchor: '--template-menu' } as CSSProperties}
        onToggle={(event: ToggleEvent<HTMLUListElement>) => setOpen(event.newState === 'open')}
        aria-label={t('navbar.templates')}
        className="dropdown list mt-2 max-h-[75vh] min-w-72 w-max max-w-100 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        <TemplateList open={open} onClose={() => popoverRef.current?.hidePopover()} />
      </ul>
    </>
  )
}
