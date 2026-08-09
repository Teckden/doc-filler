import { resolveLocale, type Locale } from './config'

const DATE_TAGS: Record<Locale, string> = { en: 'en-US', uk: 'uk-UA' }

export const formatUploadedDate = (timestamp: number, language: string): string =>
  new Intl.DateTimeFormat(DATE_TAGS[resolveLocale(language)], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(timestamp)
