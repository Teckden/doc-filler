import { useTemplates } from '../hooks/useTemplates'
import { DynamicForm } from './DynamicForm'
import { ExportButton } from './ExportButton'
import { ProgressBar } from './ProgressBar'

// The fill-form area for the active template. Reads template data from the data
// hook; the values themselves live in FieldValuesContext (consumed by the children).
export const Workspace = () => {
  const { activeTemplate } = useTemplates()
  if (!activeTemplate) return null

  const { fields, name } = activeTemplate

  return (
    <div className="@container mx-auto w-full max-w-[880px] px-6 py-8 sm:px-10">
      <header className="space-y-1">
        <h1 className="text-[15px] font-semibold">Fill in document fields</h1>
        <p className="text-[12.5px] text-base-content/60">
          Enter a value for each field detected in <span className="font-medium">{name}</span>, then
          export.
        </p>
      </header>

      {fields.length > 0 && <ProgressBar fields={fields} />}

      <div className="mt-6">
        {fields.length > 0 ? (
          <DynamicForm fields={fields} />
        ) : (
          <div role="alert" className="alert alert-info">
            <span>No fields found in this template. You can still export it unchanged.</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <ExportButton className="btn btn-primary gap-1.5" />
      </div>
    </div>
  )
}
