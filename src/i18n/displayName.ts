import type { TFunction } from 'i18next'

// Templates persist a neutral empty name when the source filename is blank (see
// db/templates.ts); the localized "Untitled" label is resolved here at display
// time so it follows the active language instead of freezing to one.
export const templateDisplayName = (name: string, t: TFunction): string =>
  name.trim() ? name : t('templates.untitled')
