import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ServiceRecordContext, type QueuedCeremony } from './ServiceRecordContext'
import { ActivityEvents } from '../events/ActivityEvents'
import { ServiceRecord, type Ceremony, type ServiceRecordI } from '../models/ServiceRecord'

export const ServiceRecordProvider = ({ children }: { children: ReactNode }) => {
  const record = useLiveQuery<ServiceRecordI>(ServiceRecord.get)
  const [queue, setQueue] = useState<QueuedCeremony[]>([])
  const [dismissedPromotionCount, setDismissedPromotionCount] = useState(0)
  const openedRef = useRef(false)
  const queueRef = useRef(queue)

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  const enqueue = useCallback((ceremonies: Ceremony[]) => {
    if (ceremonies.length === 0) return
    const seeded = ceremonies.map((ceremony) => ({ ...ceremony, seed: Math.random() }))
    setQueue((prev) => [...prev, ...seeded])
  }, [])

  useEffect(() => {
    const unsubscribe = ActivityEvents.subscribe((event) => {
      ServiceRecord.recordEvent(event)
        .then(enqueue)
        .catch(() => {})
    })
    if (!openedRef.current) {
      openedRef.current = true
      ActivityEvents.emit({ type: 'open' })
    }
    return unsubscribe
  }, [enqueue])

  const dismissCeremony = useCallback(() => {
    if (queueRef.current[0]?.kind === 'promotion') {
      setDismissedPromotionCount((count) => count + 1)
    }
    setQueue((prev) => prev.slice(1))
  }, [])

  const replayPromotion = useCallback(() => {
    if (!record || record.rank < 1) return
    enqueue([{ kind: 'promotion', rank: record.rank, orderNo: record.orderNo }])
  }, [record, enqueue])

  const value = useMemo(
    () => ({
      record,
      ceremony: queue[0] ?? null,
      dismissedPromotionCount,
      dismissCeremony,
      replayPromotion,
    }),
    [record, queue, dismissedPromotionCount, dismissCeremony, replayPromotion],
  )

  return <ServiceRecordContext value={value}>{children}</ServiceRecordContext>
}
