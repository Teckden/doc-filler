import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AppStateContext, type ActiveModal, type Toast, type ToastTone } from './AppStateContext'

const TOAST_DURATION = 2600

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const openModal = useCallback((modal: ActiveModal) => setActiveModal(modal), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  // Fire-and-forget: each toast carries its own dismissal timer, so callers never
  // manage show/hide. Multiple messages stack.
  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), TOAST_DURATION)
  }, [])

  const value = useMemo(
    () => ({ activeModal, openModal, closeModal, toasts, notify }),
    [activeModal, openModal, closeModal, toasts, notify],
  )

  return <AppStateContext value={value}>{children}</AppStateContext>
}
