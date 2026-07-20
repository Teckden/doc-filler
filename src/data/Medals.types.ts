import type { LocalizedText } from '../i18n/config'
import type { MedalBranchId } from './MedalBranches.types'

export type MedalId =
  | 'mobilization'
  | 'direct-hit'
  | 'marksman'
  | 'sniper'
  | 'quartermaster'
  | 'arsenal'
  | 'rapid-deployment'
  | 'supply-lines'
  | 'reinforcements'
  | 'motor-pool'
  | 'seasoned'
  | 'veteran'
  | 'old-guard'
  | 'night-ops'
  | 'interpreter'
  | 'scorched-earth'

export type MedalMetric =
  | 'templatesUploaded'
  | 'templatesStored'
  | 'perfectExports'
  | 'darkExports'
  | 'rapidExports'
  | 'presetsCreated'
  | 'presetPacksExported'
  | 'presetPacksImported'
  | 'languageSwitches'
  | 'fieldClears'
  | 'activeDays'

export interface MedalRequirement {
  metric: MedalMetric
  target: number
}

export interface Medal {
  id: MedalId
  name: LocalizedText
  condition: LocalizedText
  quip: LocalizedText
  branch: MedalBranchId
  activatedBy: MedalId | null
  requirement: MedalRequirement
}
