import { Medals } from '../data/Medals'
import { Ranks, MAX_RANK } from '../data/Ranks'
import type { Medal, MedalId, MedalMetric } from '../data/Medals.types'
import type { Rank, RankRequirements } from '../data/Ranks.types'
import type { ActivityEvent } from '../events/ActivityEvents.types'
import type { Ceremony, ServiceRecordI } from './ServiceRecord.types'

export type RecordedActivity = Exclude<ActivityEvent, { type: 'presetApplied' }>

const EXPORT_COOLDOWN_MS = 60_000
const RAPID_WINDOW_MS = 5 * 60_000

const GAUGE_METRICS: ReadonlySet<MedalMetric> = new Set(['templatesStored'])

const localIsoDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const isEarned = (record: ServiceRecordI, medal: Medal): boolean =>
  Boolean(record.medals[medal.id])

export const earnedAt = (record: ServiceRecordI, medal: Medal): string | null =>
  record.medals[medal.id] ?? null

export const isMedalActive = (record: ServiceRecordI, medal: Medal): boolean =>
  !record.medals[medal.id] &&
  (medal.activatedBy === null || Boolean(record.medals[medal.activatedBy]))

export const medalsEarnedCount = (record: ServiceRecordI): number =>
  Object.keys(record.medals).length

export const promoProgress = (record: ServiceRecordI): number => record.progress.promo ?? 0

export const nextRank = (record: ServiceRecordI): Rank | null =>
  record.rank >= MAX_RANK ? null : Ranks[record.rank + 1]

export const progressFor = (record: ServiceRecordI, medal: Medal, templateCount: number): number =>
  GAUGE_METRICS.has(medal.requirement.metric)
    ? Math.min(templateCount, medal.requirement.target)
    : Math.min(record.progress[medal.id] ?? 0, medal.requirement.target)

export const withPresetApplied = (
  record: ServiceRecordI,
  now: Date = new Date(),
): ServiceRecordI => ({ ...record, lastPresetAppliedAt: now.toISOString() })

const advancedMetrics = (event: RecordedActivity, rapid: boolean): MedalMetric[] => {
  switch (event.type) {
    case 'export': {
      const metrics: MedalMetric[] = []
      if (event.perfect) metrics.push('perfectExports')
      if (event.dark) metrics.push('darkExports')
      if (rapid) metrics.push('rapidExports')
      return metrics
    }
    case 'upload':
      return ['templatesUploaded', 'templatesStored']
    case 'preset':
      return ['presetsCreated']
    case 'packExport':
      return ['presetPacksExported']
    case 'packImport':
      return ['presetPacksImported']
    case 'langSwitch':
      return ['languageSwitches']
    case 'clear':
      return ['fieldClears']
    case 'open':
      return []
  }
}

const processMetrics = (
  state: ServiceRecordI,
  metrics: MedalMetric[],
  activeSnapshot: Set<MedalId>,
  ceremonies: Ceremony[],
  now: Date,
  templateCount?: number,
) => {
  for (const medal of Medals) {
    if (!metrics.includes(medal.requirement.metric)) continue
    if (GAUGE_METRICS.has(medal.requirement.metric)) {
      if (!isMedalActive(state, medal)) continue
      if ((templateCount ?? 0) < medal.requirement.target) continue
      delete state.progress[medal.id]
      state.medals[medal.id] = now.toISOString()
      ceremonies.push({ kind: 'medal', medalId: medal.id })
      continue
    }
    if (!activeSnapshot.has(medal.id)) continue
    const next = (state.progress[medal.id] ?? 0) + 1
    if (next >= medal.requirement.target) {
      delete state.progress[medal.id]
      state.medals[medal.id] = now.toISOString()
      ceremonies.push({ kind: 'medal', medalId: medal.id })
    } else {
      state.progress[medal.id] = next
    }
  }
}

export const meetsRequirements = (
  record: ServiceRecordI,
  requirements: RankRequirements,
): boolean =>
  promoProgress(record) >= requirements.exports &&
  requirements.medals.required.every((medalId) => Boolean(record.medals[medalId])) &&
  medalsEarnedCount(record) >= requirements.medals.count

const tryPromotion = (state: ServiceRecordI, ceremonies: Ceremony[], now: Date): boolean => {
  if (state.rank >= MAX_RANK) return false
  const next = Ranks[state.rank + 1]
  if (!meetsRequirements(state, next.requirements)) return false
  state.rank = next.index
  state.promotedAt = now.toISOString()
  state.orderNo += 1
  state.progress.promo = 0
  ceremonies.push({ kind: 'promotion', rank: state.rank, orderNo: state.orderNo })
  return true
}

export const applyServiceEvent = (
  previous: ServiceRecordI,
  event: RecordedActivity,
  now: Date = new Date(),
  templateCount?: number,
): { record: ServiceRecordI; ceremonies: Ceremony[] } => {
  const state: ServiceRecordI = {
    ...previous,
    medals: { ...previous.medals },
    progress: { ...previous.progress },
    activeDays: [...previous.activeDays],
  }
  const ceremonies: Ceremony[] = []

  const limited =
    event.type === 'export' &&
    state.lastCountedExportAt !== null &&
    now.getTime() - Date.parse(state.lastCountedExportAt) < EXPORT_COOLDOWN_MS

  let promoted = false

  if (!limited) {
    const rapid =
      event.type === 'export' &&
      state.lastPresetAppliedAt !== null &&
      now.getTime() - Date.parse(state.lastPresetAppliedAt) < RAPID_WINDOW_MS

    if (event.type === 'export') {
      state.lastCountedExportAt = now.toISOString()
      state.lifetimeExports += 1
      if (state.rank > 0) state.progress.promo = promoProgress(state) + 1
    }

    const metrics = advancedMetrics(event, rapid)

    if (metrics.length > 0) {
      const snapshot = new Set(
        Medals.filter((medal) => isMedalActive(previous, medal)).map((medal) => medal.id),
      )
      processMetrics(state, metrics, snapshot, ceremonies, now, templateCount)
    }

    if (event.type !== 'open') promoted = tryPromotion(state, ceremonies, now)
  }

  if (state.medals.mobilization) {
    const today = localIsoDate(now)
    if (!state.activeDays.includes(today)) {
      state.activeDays.push(today)
      const daySnapshot = new Set(
        Medals.filter((medal) => isMedalActive(state, medal)).map((medal) => medal.id),
      )
      processMetrics(state, ['activeDays'], daySnapshot, ceremonies, now)
      if (!promoted) tryPromotion(state, ceremonies, now)
    }
  }

  return { record: state, ceremonies }
}
