import type { LocalizedText } from '../i18n/config'

export type RankGroupId = 'enlisted' | 'sergeants' | 'officers' | 'generals'

export interface RankGroup {
  id: RankGroupId
  label: LocalizedText
  promotionQuip: LocalizedText
}
