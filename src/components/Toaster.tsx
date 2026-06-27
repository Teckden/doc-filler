import { useAppState } from '../contexts/AppStateContext'

// Renders the toast stack from AppStateContext. Dismissal is owned by the context
// (each toast self-expires), so this is purely presentational.
export const Toaster = () => {
  const { toasts } = useAppState()
  if (toasts.length === 0) return null

  return (
    <div className="toast toast-end z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`alert text-sm shadow-lg ${
            toast.tone === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
