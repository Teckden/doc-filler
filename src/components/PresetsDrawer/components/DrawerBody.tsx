import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../../contexts/AppStateContext'
import { usePresets } from '../../../hooks/usePresets'
import { deletePreset } from '../../../db/presets'
import { usePresetDraft } from '../hooks/usePresetDraft'
import { DrawerHeader } from './DrawerHeader'
import { PresetListView } from './PresetListView'
import { PresetEditorView } from './PresetEditorView'
import { DeletePresetDialog } from './DeletePresetDialog'

export const DrawerBody = () => {
  const { t } = useTranslation()
  const { closePresetsPanel, notify } = useAppState()
  const { presets, loading } = usePresets()
  const { draft, startNew, startEdit, patch, cancel, save } = usePresetDraft()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = presets.find((preset) => preset.id === deleteId) ?? null

  const confirmDelete = async () => {
    if (!deleteId) return
    await deletePreset(deleteId)
    if (draft?.id === deleteId) cancel()
    setDeleteId(null)
    notify(t('presets.deleted'))
  }

  return (
    <>
      <DrawerHeader onClose={closePresetsPanel} />

      {draft ? (
        <PresetEditorView
          draft={draft}
          onPatch={patch}
          onCancel={cancel}
          onSave={() => void save()}
          onDelete={() => draft.id && setDeleteId(draft.id)}
        />
      ) : (
        <PresetListView
          presets={presets}
          loading={loading}
          onNew={startNew}
          onEdit={startEdit}
          onDelete={setDeleteId}
        />
      )}

      <DeletePresetDialog
        preset={deleteTarget}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
