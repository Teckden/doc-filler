import { useTranslation } from 'react-i18next'
import { SUPPORTED_LOCALES, type Locale } from '../i18n/config'
import { CheckIcon, ChevronDownIcon, GlobeIcon } from './icons'

// Endonyms stay constant regardless of the active UI language, so they live here
// rather than in the translation catalog.
const LOCALE_LABELS: Record<Locale, { name: string; short: string }> = {
  en: { name: 'English', short: 'EN' },
  uk: { name: 'Українська', short: 'УК' },
}

// Blur the open trigger so the CSS-only daisyUI dropdown closes after a choice
// (same approach as TemplateList).
const closeDropdown = () => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}

export const LanguageMenu = () => {
  const { t, i18n } = useTranslation()
  const current: Locale = i18n.resolvedLanguage === 'uk' ? 'uk' : 'en'

  const change = (locale: Locale) => {
    void i18n.changeLanguage(locale)
    closeDropdown()
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm gap-1.5 font-normal"
        aria-label={t('language.label')}
      >
        <GlobeIcon className="size-4 text-base-content/70" />
        <span className="hidden text-sm sm:inline">{LOCALE_LABELS[current].short}</span>
        <ChevronDownIcon className="size-3.5 text-base-content/55" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-2 w-44 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        {SUPPORTED_LOCALES.map((locale) => {
          const isActive = locale === current
          return (
            <li key={locale}>
              <button
                type="button"
                className={isActive ? 'font-medium text-primary' : ''}
                onClick={() => change(locale)}
              >
                {LOCALE_LABELS[locale].name}
                {isActive && <CheckIcon className="ml-auto size-4" />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
