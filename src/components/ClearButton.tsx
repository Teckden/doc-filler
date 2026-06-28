import { useTranslation } from 'react-i18next'
import { useAppState } from '../contexts/AppStateContext'
import { useFieldValues } from '../contexts/FieldValuesContext'

interface Props {
  className?: string
}

export const ClearButton = ({ className = '' }: Props) => {
  const { t } = useTranslation()
  const { values } = useFieldValues()
  const { openModal } = useAppState()
  const hasValues = Object.values(values).some((value) => value.trim() !== '')

  return (
    <button
      type="button"
      className={`btn btn-ghost font-normal ${className}`}
      disabled={!hasValues}
      onClick={() => openModal({ type: 'clearFields' })}
    >
      {t('clear.button')}
    </button>
  )
}
