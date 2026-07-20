import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../contexts/AppStateContext'
import { useServiceRecord } from '../../contexts/ServiceRecordContext'
import { useTemplates } from '../../hooks/useTemplates'
import { Medals, MedalById } from '../../data/Medals'
import { Ranks } from '../../data/Ranks'
import { RankGroups } from '../../data/RankGroups'
import { resolveLocale } from '../../i18n/config'
import { ServiceRecord } from '../../models/ServiceRecord'
import {
  kraftTagStyle,
  ladderDotStyle,
  medalDiscStyle,
  medalRibbonStyle,
  strapStyle,
} from './helpers/art'
import { StrapInsignia } from './StrapInsignia'
import { MedalGlyph } from './MedalGlyph'
import { formatServiceDate } from './ServiceRecordModal.helpers'

type ReqRow = { key: string; ok: boolean; label: string; value: string; bar: number | null }

export const ServiceRecordModal = () => {
  const { t, i18n } = useTranslation()
  const { activeModal, closeModal } = useAppState()
  const { record, replayPromotion } = useServiceRecord()
  const { templates } = useTemplates()
  const open = activeModal?.type === 'serviceRecord'

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  if (!record) return null

  const locale = resolveLocale(i18n.resolvedLanguage)
  const rank = record.rank
  const medalsEarned = ServiceRecord.medalsEarnedCount(record)
  const next = ServiceRecord.nextRank(record)
  const promo = ServiceRecord.promoProgress(record)

  let lead = ''
  const reqRows: ReqRow[] = []
  if (next) {
    const requirements = next.requirements
    const remaining = Math.max(0, requirements.exports - promo)
    const medalsOk =
      requirements.medals.required.every((medalId) =>
        ServiceRecord.isEarned(record, MedalById[medalId]),
      ) && medalsEarned >= requirements.medals.count
    lead =
      rank === 0
        ? t('service.record.civilianLead')
        : remaining === 1 && medalsOk
          ? t('service.record.leadReady')
          : remaining > 0
            ? t('service.record.leadRemaining', { count: remaining })
            : t('service.record.leadMedals')
    if (requirements.exports > 0) {
      reqRows.push({
        key: 'exports',
        ok: promo >= requirements.exports,
        label: t('service.record.exportsRow'),
        value: t('service.record.exportsOf', { current: promo, target: requirements.exports }),
        bar: Math.min(100, Math.round((promo / requirements.exports) * 100)),
      })
    }
    for (const medalId of requirements.medals.required) {
      const requiredMedal = MedalById[medalId]
      const medalEarned = ServiceRecord.isEarned(record, requiredMedal)
      reqRows.push({
        key: requiredMedal.id,
        ok: medalEarned,
        label: rank === 0 ? requiredMedal.condition[locale] : requiredMedal.name[locale],
        value: medalEarned
          ? t('service.record.earned')
          : ServiceRecord.isMedalActive(record, requiredMedal)
            ? `${ServiceRecord.progressFor(record, requiredMedal, templates.length)} / ${requiredMedal.requirement.target}`
            : '···',
        bar: null,
      })
    }
    if (requirements.medals.count > 0) {
      reqRows.push({
        key: 'count',
        ok: medalsEarned >= requirements.medals.count,
        label: t('service.record.medalCountLabel'),
        value: t('service.record.medalCountOf', {
          current: medalsEarned,
          target: requirements.medals.count,
        }),
        bar: null,
      })
    }
  }

  const nextIdx = rank + 1
  const currentGroup = Ranks[rank].rankGroup
  const maxGroupIndex = next
    ? RankGroups.findIndex((group) => group.id === next.rankGroup)
    : RankGroups.length - 1
  const ladder = RankGroups.map((group, groupIndex) => {
    if (groupIndex > maxGroupIndex) {
      return {
        key: group.id,
        label: '···',
        anonymous: true,
        note: '',
        steps: [0, 1, 2].map((i) => ({ key: `x${i}`, state: 'anonymous' as const, tip: '···' })),
      }
    }
    return {
      key: group.id,
      label: group.label[locale],
      anonymous: false,
      note: group.id === currentGroup ? t('service.record.youAreHere') : '',
      steps: Ranks.filter((r) => r.rankGroup === group.id).map((r) => {
        const state =
          r.index < rank
            ? ('earned' as const)
            : r.index === rank
              ? ('current' as const)
              : r.index === nextIdx
                ? ('next' as const)
                : ('future' as const)
        return {
          key: `r${r.index}`,
          state,
          tip: state === 'future' ? '···' : r.name[locale],
        }
      }),
    }
  })

  const medalCards = Medals.filter(
    (medal) => ServiceRecord.isEarned(record, medal) || ServiceRecord.isMedalActive(record, medal),
  ).map((medal) => {
    const earnedAt = ServiceRecord.earnedAt(record, medal)
    return {
      id: medal.id,
      branch: medal.branch,
      earned: earnedAt !== null,
      name: medal.name[locale],
      line2: earnedAt !== null ? medal.quip[locale] : medal.condition[locale],
      sub:
        earnedAt !== null
          ? formatServiceDate(locale, earnedAt)
          : `${ServiceRecord.progressFor(record, medal, templates.length)} / ${medal.requirement.target}`,
    }
  })

  const replay = () => {
    closeModal()
    replayPromotion()
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box flex max-w-2xl flex-col overflow-hidden bg-base-100 p-0">
        <div className="flex shrink-0 items-center gap-4 border-b border-base-300 bg-base-200/60 px-6 pt-6 pb-5">
          <span style={strapStyle(rank, 'lg')}>
            <StrapInsignia rank={rank} size="lg" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wider opacity-55">
              {t('service.record.title')}
            </div>
            <div className="mt-0.5 text-lg font-bold leading-tight">{Ranks[rank].name[locale]}</div>
            <div className="mt-0.5 text-xs opacity-60">
              {rank === 0
                ? t('service.record.civilianSubtitle')
                : t('service.record.sinceDate', {
                    date: record.promotedAt ? formatServiceDate(locale, record.promotedAt) : '',
                  })}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square shrink-0"
            aria-label={t('common.close')}
            onClick={closeModal}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="stats w-full rounded-none border-b border-base-300 bg-transparent">
            {[
              {
                key: 'docs',
                value: record.lifetimeExports,
                label: t('service.record.statDocuments'),
              },
              { key: 'days', value: record.activeDays.length, label: t('service.record.statDays') },
              { key: 'medals', value: medalsEarned, label: t('service.record.statMedals') },
            ].map((stat) => (
              <div key={stat.key} className="stat place-items-center px-5 py-4">
                <div className="stat-value text-xl tabular-nums">{stat.value}</div>
                <div className="stat-title text-xs uppercase tracking-wider opacity-55">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3.5 border-b border-base-300 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
              {t('service.record.nextRank')}
            </div>
            {next ? (
              <>
                <div className="flex items-center gap-3">
                  <span style={strapStyle(next.index, 'sm')}>
                    <StrapInsignia rank={next.index} size="sm" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight">{next.name[locale]}</div>
                    <div className="mt-0.5 text-xs opacity-60">{lead}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {reqRows.map((row) => (
                    <div key={row.key} className="flex items-start gap-3">
                      <span
                        className={`w-4 text-center text-xs leading-4.5 ${row.ok ? 'text-success' : 'opacity-40'}`}
                      >
                        {row.ok ? '✓' : '○'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-xs">{row.label}</span>
                          <span className="whitespace-nowrap text-xs tabular-nums opacity-60">
                            {row.value}
                          </span>
                        </div>
                        {row.bar !== null && (
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-base-300">
                            <div
                              className="h-full rounded-full bg-primary/70 transition-all duration-300"
                              style={{ width: `${row.bar}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm opacity-70">{t('service.record.summit')}</div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-b border-base-300 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
              {t('service.record.ladder')}
            </div>
            {ladder.map((row) => (
              <div
                key={row.key}
                className={`flex items-center gap-3 ${row.anonymous ? 'opacity-60' : ''}`}
              >
                <span className="w-28 shrink-0 text-xs uppercase tracking-wider opacity-55">
                  {row.label}
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  {row.steps.map((step) => (
                    <span key={step.key} className="group/dot relative inline-flex items-center">
                      <span className="block rounded-full" style={ladderDotStyle(step.state)} />
                      <span
                        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/dot:opacity-100"
                        style={{
                          ...kraftTagStyle(-2),
                          transform: 'translateX(-50%) rotate(-2deg)',
                        }}
                      >
                        {step.tip}
                      </span>
                    </span>
                  ))}
                </div>
                <span className="whitespace-nowrap text-right text-xs tabular-nums opacity-60">
                  {row.note}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
              {t('service.record.medals')}
            </div>
            <div className="flex flex-wrap gap-5">
              {medalCards.map((card) => (
                <div key={card.id} className="flex w-26 flex-col items-center gap-1 text-center">
                  <div className="flex flex-col items-center">
                    <span style={medalRibbonStyle(card.branch, card.earned, 'sm')} />
                    <span style={medalDiscStyle(card.earned, 'sm')}>
                      <MedalGlyph branch={card.branch} size="sm" />
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold leading-tight ${card.earned ? '' : 'opacity-55'}`}
                  >
                    {card.name}
                  </span>
                  <span className="text-xs leading-snug opacity-60" style={{ textWrap: 'pretty' }}>
                    {card.line2}
                  </span>
                  <span className="text-xs leading-tight tabular-nums opacity-50">{card.sub}</span>
                </div>
              ))}
            </div>
            <div className="text-xs opacity-45">{t('service.record.footnote')}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-base-300 px-6 py-3">
          <span className="text-xs opacity-45">{t('service.record.storageNote')}</span>
          {import.meta.env.DEV && rank > 0 && (
            <button type="button" className="btn btn-ghost btn-xs text-primary" onClick={replay}>
              {t('service.record.replay')}
            </button>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button aria-label={t('common.close')}>{t('common.close')}</button>
      </form>
    </dialog>
  )
}
