import { Trans, useTranslation } from 'react-i18next'
import { DocumentIcon, PlusIcon } from './icons'

type EmptyStateProps = {
  onUpload: () => void
}

export const EmptyState = ({ onUpload }: EmptyStateProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-box border-2 border-dashed border-base-300">
        <DocumentIcon className="size-8 text-base-content/35" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">{t('empty.title')}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-base-content/65">
        <Trans
          i18nKey="empty.body"
          components={{
            code: <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs" />,
          }}
          values={{ token: '{{placeholders}}' }}
        />
      </p>
      <button type="button" className="btn btn-primary mt-5 gap-1.5" onClick={onUpload}>
        <PlusIcon className="size-4" />
        {t('empty.cta')}
      </button>
      <p className="mt-3 text-xs text-base-content/45">{t('empty.format')}</p>
    </div>
  )
}
