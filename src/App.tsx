import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { EmptyState } from './components/EmptyState'
import { Workspace } from './components/Workspace'
import { PreviewPane } from './components/PreviewPane'
import { ModalHost } from './components/ModalHost'
import { PresetsDrawer } from './components/PresetsDrawer'
import { Toaster } from './components/Toaster'
import { useTemplates } from './hooks/useTemplates'
import { usePreviewVisible } from './hooks/usePreviewVisible'
import { useAppState } from './contexts/AppStateContext'

export const App = () => {
  const { loading, activeTemplate } = useTemplates()
  const { openModal } = useAppState()
  const [previewVisible, setPreviewVisible] = usePreviewVisible()

  return (
    <div className="flex h-screen flex-col bg-base-200 text-base-content">
      <Navbar
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((visible) => !visible)}
      />

      <main className="flex min-h-0 flex-1">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="loading loading-spinner loading-md text-base-content/40"></span>
          </div>
        ) : !activeTemplate ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyState onUpload={() => openModal({ type: 'upload' })} />
          </div>
        ) : (
          <>
            <section
              className={`min-w-0 flex-1 overflow-y-auto ${previewVisible ? 'border-r border-base-300' : ''}`}
            >
              <div
                className={`mx-auto w-full ${previewVisible ? 'max-w-[680px]' : 'max-w-[880px]'}`}
              >
                <Workspace />
              </div>
            </section>
            {previewVisible && <PreviewPane template={activeTemplate} />}
          </>
        )}
      </main>

      <Footer />

      <ModalHost />
      <PresetsDrawer />
      <Toaster />
    </div>
  )
}
