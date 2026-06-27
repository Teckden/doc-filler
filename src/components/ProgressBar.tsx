import { useTranslation } from 'react-i18next'
import { useFieldValues } from '../contexts/FieldValuesContext'

// Consumes field values directly so it re-renders on each keystroke without
// dragging the rest of the workspace with it.
export const ProgressBar = ({ fields }: { fields: string[] }) => {
  const { t } = useTranslation()
  const { values } = useFieldValues()
  const filled = fields.filter((field) => (values[field] ?? '').trim() !== '').length
  const progress = fields.length === 0 ? 0 : Math.round((filled / fields.length) * 100)

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-300">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-base-content/55">
        {t('progress.filled', { filled, total: fields.length })}
      </span>
    </div>
  )
}
