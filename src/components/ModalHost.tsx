import { useAppState } from '../contexts/AppStateContext'
import { UploadModal } from './UploadModal'
import { RenameModal } from './RenameModal'

export const ModalHost = () => {
  const { activeModal } = useAppState()
  return (
    <>
      {activeModal?.type === 'upload' && <UploadModal />}
      {activeModal?.type === 'rename' && <RenameModal />}
    </>
  )
}
