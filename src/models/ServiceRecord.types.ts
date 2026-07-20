import type { MedalId } from '../data/Medals.types'

export interface ServiceRecordI {
  rank: number
  promotedAt: string | null
  orderNo: number
  medals: Partial<Record<MedalId, string>>
  progress: Partial<Record<MedalId | 'promo', number>>
  activeDays: string[]
  lifetimeExports: number
  lastCountedExportAt: string | null
  lastPresetAppliedAt: string | null
}

export type Ceremony =
  | { kind: 'medal'; medalId: MedalId }
  | { kind: 'promotion'; rank: number; orderNo: number }
