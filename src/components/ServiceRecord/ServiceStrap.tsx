import { useTranslation } from 'react-i18next'
import { useAppState } from '../../contexts/AppStateContext'
import { useServiceRecord } from '../../contexts/ServiceRecordContext'
import { Ranks } from '../../data/Ranks'
import { resolveLocale } from '../../i18n/config'
import { kraftTagStyle, strapStyle } from './helpers/art'
import { StrapInsignia } from './StrapInsignia'

export const ServiceStrap = () => {
  const { t, i18n } = useTranslation()
  const { openModal } = useAppState()
  const { record, dismissedPromotionCount } = useServiceRecord()
  if (!record) return null

  const rank = record.rank
  const tag = Ranks[rank].shortName[resolveLocale(i18n.resolvedLanguage)]

  return (
    <button
      type="button"
      className="group fixed right-5 bottom-4.5 z-30 hidden cursor-pointer sm:block"
      aria-label={t('service.record.title')}
      onClick={() => openModal({ type: 'serviceRecord' })}
    >
      <span className="block" style={{ animation: 'dfSettle .9s cubic-bezier(.3,1.2,.5,1) both' }}>
        <span
          className="block -rotate-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:-rotate-2"
          style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.32))' }}
        >
          <span className="relative overflow-hidden" style={strapStyle(rank, 'desk')}>
            <StrapInsignia rank={rank} size="desk" />
            {dismissedPromotionCount > 0 && (
              <span
                key={dismissedPromotionCount}
                style={{
                  position: 'absolute',
                  top: '-20%',
                  left: 0,
                  width: '40%',
                  height: '140%',
                  background:
                    'linear-gradient(105deg,transparent,rgba(255,255,255,.3),transparent)',
                  animation: 'dfShine 1.6s 3s both',
                }}
              />
            )}
          </span>
        </span>
      </span>
      <span
        className="pointer-events-none absolute top-1 right-full mr-3 whitespace-nowrap opacity-0 transition-all duration-200 group-hover:opacity-100"
        style={kraftTagStyle(-3)}
      >
        {tag}
      </span>
    </button>
  )
}
