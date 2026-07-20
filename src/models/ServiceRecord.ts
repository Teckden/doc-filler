import { db } from '../db/templates'
import { MedalById } from '../data/Medals'
import type { ActivityEvent } from '../events/ActivityEvents.types'
import {
  applyServiceEvent,
  earnedAt,
  isEarned,
  isMedalActive,
  medalsEarnedCount,
  nextRank,
  progressFor,
  promoProgress,
  withPresetApplied,
} from './ServiceRecord.helpers'

import type { Ceremony, ServiceRecordI } from './ServiceRecord.types'

export type { Ceremony, ServiceRecordI } from './ServiceRecord.types'

export const SERVICE_RECORD_KEY = 'service'

export const initialServiceRecord: ServiceRecordI = {
  rank: 0,
  promotedAt: null,
  orderNo: 0,
  medals: {},
  progress: {},
  activeDays: [],
  lifetimeExports: 0,
  lastCountedExportAt: null,
  lastPresetAppliedAt: null,
}

const markPresetApplied = async (): Promise<void> => {
  await db.transaction('rw', db.serviceRecord, async () => {
    const stored = await ServiceRecord.get()
    await db.serviceRecord.put(withPresetApplied(stored), SERVICE_RECORD_KEY)
  })
}

export const ServiceRecord = {
  apply: applyServiceEvent,
  isEarned,
  earnedAt,
  isMedalActive,
  medalsEarnedCount,
  promoProgress,
  progressFor,
  nextRank,
  get: async (): Promise<ServiceRecordI> => {
    return (await db.serviceRecord.get(SERVICE_RECORD_KEY)) ?? initialServiceRecord
  },
  recordEvent: async (event: ActivityEvent): Promise<Ceremony[]> => {
    if (event.type === 'presetApplied') {
      await markPresetApplied()
      return []
    }
    const tables = event.type === 'upload' ? [db.serviceRecord, db.templates] : [db.serviceRecord]
    return db.transaction('rw', tables, async () => {
      const stored = await ServiceRecord.get()
      if (event.type === 'open' && !isEarned(stored, MedalById.mobilization)) return []
      const templateCount = event.type === 'upload' ? await db.templates.count() : undefined
      const { record, ceremonies } = applyServiceEvent(stored, event, new Date(), templateCount)
      await db.serviceRecord.put(record, SERVICE_RECORD_KEY)
      return ceremonies
    })
  },
}
