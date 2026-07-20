export const formatServiceDate = (locale: string, iso: string): string =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
