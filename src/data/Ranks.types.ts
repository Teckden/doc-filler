import type { LocalizedText } from '../i18n/config'
import type { MedalId } from './Medals.types'
import type { RankGroupId } from './RankGroups.types'

export interface RankRequirements {
  exports: number
  medals: {
    required: MedalId[]
    count: number
  }
}

export interface Rank {
  index: number
  rankGroup: RankGroupId | null
  requirements: RankRequirements
  name: LocalizedText
  shortName: LocalizedText
}
