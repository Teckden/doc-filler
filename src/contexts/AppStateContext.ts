import { createContext, useContext } from 'react'

// Only one modal is open at a time. Rename references the template by id; the modal
// looks the rest up from the templates data, so no stored data is copied in here.
export type ActiveModal =
  | { type: 'upload' }
  | { type: 'rename'; templateId: string }
  | { type: 'clearFields' }
  | null

export type ToastTone = 'success' | 'error'
export type Toast = { id: string; message: string; tone: ToastTone }

export type AppStateContextValue = {
  activeModal: ActiveModal
  openModal: (modal: ActiveModal) => void
  closeModal: () => void
  // NOTE: If drawer will be growing in types then convert it into modal system as well
  presetsPanelOpen: boolean
  openPresetsPanel: () => void
  closePresetsPanel: () => void
  toasts: Toast[]
  notify: (message: string, tone?: ToastTone) => void
}

export const AppStateContext = createContext<AppStateContextValue | null>(null)

export const useAppState = (): AppStateContextValue => {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within an AppStateProvider')
  return context
}
