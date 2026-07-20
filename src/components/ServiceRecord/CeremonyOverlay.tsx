import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useServiceRecord } from '../../contexts/ServiceRecordContext'
import { MedalById } from '../../data/Medals'
import { Ranks } from '../../data/Ranks'
import { RankGroupById } from '../../data/RankGroups'
import { resolveLocale } from '../../i18n/config'
import { medalDiscStyle, medalRibbonStyle, strapStyle } from './helpers/art'
import { StrapInsignia } from './StrapInsignia'
import { MedalGlyph } from './MedalGlyph'

const CONFETTI_COLORS = ['#e2b93b', '#2f5fa3', '#d4af37', '#e8e2d2']

const AUTO_DISMISS_MS = 30000

export const CeremonyOverlay = () => {
  const { t, i18n } = useTranslation()
  const { ceremony, dismissCeremony } = useServiceRecord()

  useEffect(() => {
    if (!ceremony) return
    const timer = setTimeout(dismissCeremony, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [ceremony, dismissCeremony])

  useEffect(() => {
    if (!ceremony) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        dismissCeremony()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ceremony, dismissCeremony])

  if (!ceremony) return null

  const isPromotion = ceremony.kind === 'promotion'
  const locale = resolveLocale(i18n.resolvedLanguage)
  const medal = ceremony.kind === 'medal' ? MedalById[ceremony.medalId] : null
  const medalButtons = t('service.ceremony.medalButtons', { returnObjects: true })
  const medalButton = medalButtons[Math.floor(ceremony.seed * medalButtons.length)]

  return (
    <div
      className="fixed inset-0 z-[80] hidden overflow-hidden sm:block"
      style={{
        background: 'rgba(10,14,22,0.74)',
        backdropFilter: 'blur(5px)',
        animation: 'dfFade .25s ease both',
      }}
    >
      {isPromotion &&
        Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: '-6vh',
              left: `${(i * 61) % 100}%`,
              width: 7,
              height: 11,
              borderRadius: 1,
              background: CONFETTI_COLORS[i % 4],
              animation: `dfConf ${2.6 + (i % 5) * 0.5}s linear ${(i % 7) * 0.18}s both`,
              opacity: 0.95,
            }}
          />
        ))}
      <div className="grid h-full w-full place-items-center p-6">
        <div
          className="flex max-w-md flex-col items-center gap-3 text-center"
          style={{ animation: 'dfPop .5s cubic-bezier(.2,.9,.3,1.15) both', color: '#f4f2ec' }}
        >
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: 'rgba(244,242,236,.6)' }}
          >
            {isPromotion
              ? t('service.ceremony.promoEyebrow', {
                  number: String(ceremony.orderNo).padStart(3, '0'),
                })
              : t('service.ceremony.medalEyebrow')}
          </div>
          {isPromotion ? (
            <span className="relative my-2 overflow-hidden" style={strapStyle(ceremony.rank, 'xl')}>
              <StrapInsignia rank={ceremony.rank} size="xl" />
              <span
                style={{
                  position: 'absolute',
                  top: '-20%',
                  left: 0,
                  width: '45%',
                  height: '140%',
                  background:
                    'linear-gradient(105deg,transparent,rgba(255,255,255,.35),transparent)',
                  animation: 'dfShine 1.4s .4s both',
                }}
              />
            </span>
          ) : (
            <span
              className="my-2 flex flex-col items-center"
              style={{ animation: 'dfDrop .8s cubic-bezier(.3,1.3,.5,1) both' }}
            >
              <span style={medalRibbonStyle(medal!.branch, true, 'xl')} />
              <span style={medalDiscStyle(true, 'xl')}>
                <MedalGlyph branch={medal!.branch} size="xl" />
              </span>
            </span>
          )}
          <div className="text-sm" style={{ color: 'rgba(244,242,236,.75)' }}>
            {isPromotion ? t('service.ceremony.promoLead') : t('service.ceremony.medalLead')}
          </div>
          <div className="text-3xl font-bold leading-tight" style={{ textWrap: 'balance' }}>
            {isPromotion ? Ranks[ceremony.rank].name[locale] : medal!.name[locale]}
          </div>
          <div className="text-sm" style={{ color: 'rgba(244,242,236,.7)', textWrap: 'pretty' }}>
            {isPromotion
              ? RankGroupById[Ranks[ceremony.rank].rankGroup!].promotionQuip[locale]
              : medal!.quip[locale]}
          </div>
          <button type="button" className="btn btn-primary mt-2" onClick={dismissCeremony}>
            {isPromotion ? t('service.ceremony.promoButton') : medalButton}
          </button>
          <div className="text-xs" style={{ color: 'rgba(244,242,236,.4)' }}>
            {t('service.ceremony.hint')}
          </div>
        </div>
      </div>
    </div>
  )
}
