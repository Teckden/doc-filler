import { useTranslation } from 'react-i18next'
import { templateDisplayName } from '../i18n/displayName'
import { useTemplates } from '../hooks/useTemplates'
import { TemplateList } from './TemplateList'
import { ChevronDownIcon } from './icons'

export const TemplateSwitcher = () => {
  const { t } = useTranslation()
  const { activeTemplate } = useTemplates()

  if (!activeTemplate) return null

  const name = templateDisplayName(activeTemplate.name, t)
  const showTooltip = name.length > 22

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost h-auto min-h-0 w-56 flex-nowrap gap-2 px-2 py-1.5 font-normal${
          showTooltip
            ? ' tooltip tooltip-bottom before:max-w-[15rem] before:whitespace-normal before:break-words'
            : ''
        }`}
        data-tip={showTooltip ? name : undefined}
        aria-label={t('templates.switch', { name })}
      >
        {/* Fixed-width trigger: the name column fills and truncates so a long title
            never stretches the navbar; the chevron stays pinned to the right. */}
        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          <span className="w-full truncate text-left text-[13px] font-semibold">{name}</span>
          <span className="w-full truncate text-left text-[10px] text-base-content/55">
            {t('templates.fieldCount', { count: activeTemplate.fields.length })}
          </span>
        </span>
        <ChevronDownIcon className="size-3.5 shrink-0 text-base-content/55" />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content list z-50 mt-2 w-72 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        <TemplateList />
      </ul>
    </div>
  )
}
