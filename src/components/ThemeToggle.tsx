import { useTranslation } from 'react-i18next'
import type { Theme } from '../hooks/useTheme'

type ThemeToggleProps = {
  theme: Theme
  onChange: (theme: Theme) => void
}

export const ThemeToggle = ({ theme, onChange }: ThemeToggleProps) => {
  const { t } = useTranslation()

  return (
    <div className="join overflow-hidden rounded-md border border-base-300">
      <button
        type="button"
        className={`btn join-item btn-sm border-0 ${theme === 'gov-light' ? 'btn-primary' : 'btn-ghost'}`}
        onClick={() => onChange('gov-light')}
        title={t('theme.lightTitle')}
      >
        {t('theme.light')}
      </button>
      <button
        type="button"
        className={`btn join-item btn-sm border-0 ${theme === 'gov-dark' ? 'btn-primary' : 'btn-ghost'}`}
        onClick={() => onChange('gov-dark')}
        title={t('theme.darkTitle')}
      >
        {t('theme.dark')}
      </button>
    </div>
  )
}
