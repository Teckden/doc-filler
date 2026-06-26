import { useState } from 'react'
import { TemplateUpload } from './components/TemplateUpload'
import { DynamicForm } from './components/DynamicForm'
import { ExportButton } from './components/ExportButton'
import { Navbar } from './components/Navbar'
import { extractFields } from './lib/docx'
import { useTheme } from './hooks/useTheme'

type Template = {
  buffer: ArrayBuffer
  name: string
}

export const App = () => {
  const [theme, setTheme] = useTheme()
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
    <div className="flex min-h-screen flex-col bg-base-200 text-base-content">
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        actions={
          <ExportButton
            template={template}
            values={values}
            onError={setError}
            className="btn btn-primary btn-sm gap-1.5 font-medium"
          />
        }
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 py-10">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Fill a document template</h1>
          <p className="text-sm text-base-content/70">
            Upload a{' '}
            <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs">.docx</code>{' '}
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
                <DynamicForm fields={fields} values={values} onChange={handleFieldChange} />
              ) : (
                <div role="alert" className="alert alert-info">
                  <span>No fields found in this template. You can still export it unchanged.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
