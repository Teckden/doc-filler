import { useTranslation } from 'react-i18next'
import { useFieldValues } from '../contexts/FieldValuesContext'
import { useDocxPreview } from '../hooks/useDocxPreview'
import type { StoredTemplate } from '../db/templates'

// Read-only live preview of the active template with the current field values
// filled in.
export const PreviewPane = ({ template }: { template: StoredTemplate }) => {
  const { t } = useTranslation()
  const { values } = useFieldValues()
  const { hostRef, docRef, status } = useDocxPreview(template, values)

  return (
    <section className="min-w-0 flex-1 overflow-y-auto bg-base-300/70">
      <div className="sticky top-0 z-10 flex h-11 items-center justify-between border-b border-base-content/5 bg-base-300/80 px-6 backdrop-blur">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] opacity-55">
          {t('preview.title')}
        </span>
        {status === 'ready' && (
          <span className="hidden text-[11px] opacity-50 md:inline">
            {t('preview.exportReady')}
          </span>
        )}
      </div>

      <div className="flex justify-center px-8 py-9">
        <div ref={hostRef} className="w-full max-w-[720px]">
          {status === 'loading' && (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-md text-base-content/40"></span>
            </div>
          )}
          {status === 'error' && (
            <div role="alert" className="alert alert-error text-[13px]">
              <span>{t('preview.failed')}</span>
            </div>
          )}
          <div ref={docRef} className="preview-doc mx-auto w-max" />
        </div>
      </div>
    </section>
  )
}
