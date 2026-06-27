import { useTemplates } from '../hooks/useTemplates'
import { TemplateList } from './TemplateList'
import { ChevronDownIcon } from './icons'

const fieldCount = (n: number) => `${n} field${n === 1 ? '' : 's'}`

export const TemplateSwitcher = () => {
  const { activeTemplate } = useTemplates()

  if (!activeTemplate) return null

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="tooltip tooltip-bottom btn btn-ghost h-auto min-h-0 w-56 flex-nowrap gap-2 px-2 py-1.5 font-normal before:max-w-[15rem] before:whitespace-normal before:break-words"
        data-tip={activeTemplate.name}
        aria-label={`Switch template — ${activeTemplate.name}`}
      >
        {/* Fixed-width trigger: the name column fills and truncates so a long title
            never stretches the navbar; the chevron stays pinned to the right. */}
        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          <span className="w-full truncate text-left text-[13px] font-semibold">
            {activeTemplate.name}
          </span>
          <span className="w-full truncate text-left text-[10px] text-base-content/55">
            {fieldCount(activeTemplate.fields.length)}
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
