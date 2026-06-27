import type { Resources } from './locales/en'

// Makes t() keys type-checked and autocompleted against the English catalog.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: Resources }
    returnNull: false
  }
}
