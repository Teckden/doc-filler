import { createContext, useContext } from 'react'
import type { Ceremony, ServiceRecordI } from '../models/ServiceRecord.types'

export type QueuedCeremony = Ceremony & { seed: number }

export type ServiceRecordContextValue = {
  record: ServiceRecordI | undefined
  ceremony: QueuedCeremony | null
  dismissedPromotionCount: number
  dismissCeremony: () => void
  replayPromotion: () => void
}

export const ServiceRecordContext = createContext<ServiceRecordContextValue | null>(null)

export const useServiceRecord = (): ServiceRecordContextValue => {
  const context = useContext(ServiceRecordContext)
  if (!context) throw new Error('useServiceRecord must be used within a ServiceRecordProvider')
  return context
}
