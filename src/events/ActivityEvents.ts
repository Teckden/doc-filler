import { createEventBus } from './EventBus'
import type { ActivityEvent } from './ActivityEvents.types'

export const ActivityEvents = createEventBus<ActivityEvent>()
