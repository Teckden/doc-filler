import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { useAppState } from '../../../contexts/AppStateContext'
import { importPresets, type StoredPreset } from '../../../db/presets'
import { parsePresetPack, serializePresetPack } from '../../../lib/presetPack'

export interface UsePresetPack {
  exportPack: () => void
  importPack: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const usePresetPack = (presets: StoredPreset[]): UsePresetPack => {
  const { t } = useTranslation()
  const { notify } = useAppState()

  const exportPack = () => {
    const blob = new Blob([serializePresetPack(presets)], { type: 'text/yaml;charset=utf-8' })
    saveAs(blob, 'field-presets.yaml')
    notify(t('presets.exported', { count: presets.length }))
  }

  const importPack = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const entries = parsePresetPack(await file.text(), t('presets.importedName'))
      if (entries.length === 0) {
        notify(t('presets.importEmpty'), 'error')
        return
      }
      const { added, updated } = await importPresets(entries)
      notify(t('presets.imported', { count: added + updated }))
    } catch {
      notify(t('presets.importError'), 'error')
    }
  }

  return { exportPack, importPack }
}
