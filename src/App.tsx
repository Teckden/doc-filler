import { useState } from 'react'
import { TemplateUpload } from './components/TemplateUpload'
import { DynamicForm } from './components/DynamicForm'
import { ExportButton } from './components/ExportButton'
import { extractFields } from './lib/docx'

type Template = {
  buffer: ArrayBuffer
  name: string
}

export const App = () => {
  const [template, setTemplate] = useState<Template | null>(null)
  const [fields, setFields] = useState<string[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const handleTemplateLoad = async (buffer: ArrayBuffer, name: string) => {
    setError(null)
    try {
      const discovered = await extractFields(buffer)
      setTemplate({ buffer, name })
      setFields(discovered)
      setValues(Object.fromEntries(discovered.map((field) => [field, ''])))
    } catch (err) {
      setTemplate(null)
      setFields([])
      setValues({})
      setError(
        err instanceof Error
          ? `Could not parse template: ${err.message}`
          : 'Could not parse template.',
      )
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-5 py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">DocFill</h1>
        <p className="text-base-content/70">
          Upload a <code className="rounded bg-base-200 px-1 py-0.5 font-mono text-sm">.docx</code>{' '}
          template, fill its fields, and export the result.
        </p>
      </header>

      <div className="card card-border bg-base-100">
        <div className="card-body gap-4">
          <TemplateUpload onLoad={handleTemplateLoad} onError={setError} />
          {template && (
            <p className="text-sm text-base-content/60">
              Active template: <span className="font-medium">{template.name}</span>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {template && (
        <div className="card card-border bg-base-100">
          <div className="card-body gap-4">
            {fields.length > 0 ? (
              <DynamicForm
                fields={fields}
                values={values}
                onChange={handleFieldChange}
              />
            ) : (
              <div role="alert" className="alert alert-info">
                <span>
                  No fields found in this template. You can still export it unchanged.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <ExportButton template={template} values={values} onError={setError} />
      </div>
    </main>
  )
}
