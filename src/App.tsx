import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { EmptyState } from './components/EmptyState'
import { Workspace } from './components/Workspace'
import { ModalHost } from './components/ModalHost'
import { Toaster } from './components/Toaster'
import { useTemplates } from './hooks/useTemplates'
import { useAppState } from './contexts/AppStateContext'

export const App = () => {
  const { loading, activeTemplate } = useTemplates()
  const { openModal } = useAppState()

  return (
    <div className="flex h-screen flex-col bg-base-200 text-base-content">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="loading loading-spinner loading-md text-base-content/40"></span>
          </div>
        ) : !activeTemplate ? (
          <EmptyState onUpload={() => openModal({ type: 'upload' })} />
        ) : (
          <Workspace />
        )}
      </main>

      <Footer />

      <ModalHost />
      <Toaster />
    </div>
  )
}
