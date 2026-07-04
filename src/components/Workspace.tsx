import { Trans, useTranslation } from 'react-i18next'
import { useTemplates } from '../hooks/useTemplates'
import { templateDisplayName } from '../i18n/displayName'
import { DynamicForm } from './DynamicForm'
import { ExportButton } from './ExportButton'
import { ClearButton } from './ClearButton'
import { ProgressBar } from './ProgressBar'

// The fill-form area for the active template. Reads template data from the data
// hook; the values themselves live in FieldValuesContext (consumed by the children).
export const Workspace = () => {
  const { t } = useTranslation()
  const { activeTemplate } = useTemplates()
  if (!activeTemplate) return null

  const { fields, name } = activeTemplate

  return (
    <div className="@container w-full px-6 py-8 sm:px-10">
      <header className="space-y-1">
        <h1 className="text-[15px] font-semibold">{t('workspace.title')}</h1>
        <p className="break-words text-[12.5px] text-base-content/60">
          <Trans
            i18nKey="workspace.subtitle"
            components={{ b: <span className="font-medium" /> }}
            values={{ name: templateDisplayName(name, t) }}
            // The name is dynamic user data and the only interpolated value here, so
            // escape it (escapeValue) and have Trans decode it back (shouldUnescape).
            // Without this a literal '<' in the name garbles under the global
            // escapeValue:false needed for the <b> markup.
            shouldUnescape
            tOptions={{ interpolation: { escapeValue: true } }}
          />
        </p>
      </header>

      {fields.length > 0 && <ProgressBar fields={fields} />}

      <div className="mt-6">
        {fields.length > 0 ? (
          <DynamicForm fields={fields} />
        ) : (
          <div role="alert" className="alert alert-info">
            <span>{t('workspace.noFields')}</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-2">
        {fields.length > 0 && <ClearButton />}
        <ExportButton className="btn btn-primary gap-1.5" />
      </div>
    </div>
  )
}
