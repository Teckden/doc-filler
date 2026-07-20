import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'

export const SUPPORTED_LOCALES = ['en', 'uk'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export type LocalizedText = Record<Locale, string>

const STORAGE_KEY = 'docfiller.locale'
const DEFAULT_LOCALE: Locale = 'en'

const isLocale = (value: string | null): value is Locale =>
  value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value)

export const resolveLocale = (value: string | null | undefined): Locale =>
  isLocale(value ?? null) ? (value as Locale) : DEFAULT_LOCALE

// First visit defaults to English (like the theme defaults to light); after
// that the stored choice always wins. No navigator.language detection by design.
const readStoredLocale = (): Locale => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isLocale(stored) ? stored : DEFAULT_LOCALE
}

void i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLocale(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  interpolation: { escapeValue: false }, // React already escapes; off for Trans markup.
  returnNull: false,
  debug: import.meta.env.DEV,
})

// Mirror useTheme's effect: persist the choice and keep <html lang> in sync so
// assistive tech and the browser read the active language.
const syncLocale = (lng: string) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
}

i18n.on('languageChanged', syncLocale)
syncLocale(i18n.resolvedLanguage ?? DEFAULT_LOCALE)

export { i18n }
