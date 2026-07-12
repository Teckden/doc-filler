import { useTranslation } from 'react-i18next'
import { useAppState } from '../../contexts/AppStateContext'
import { DrawerBody } from './components/DrawerBody'

// drawer-side is viewport-fixed, so no drawer-content wrapper; z-50 beats the
// navbar, and scrollbar-color overrides the backdrop-tinted one it inherits.
export const PresetsDrawer = () => {
  const { t } = useTranslation()
  const { presetsPanelOpen, closePresetsPanel } = useAppState()
  if (!presetsPanelOpen) return null

  return (
    <div className="drawer drawer-end">
      <input
        id="presets-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked
        onChange={closePresetsPanel}
      />
      <div className="drawer-side z-50">
        <label htmlFor="presets-drawer" aria-label={t('common.close')} className="drawer-overlay" />
        <aside className="flex h-full w-full max-w-[420px] flex-col border-l border-base-300 bg-base-100 shadow-2xl [scrollbar-color:color-mix(in_oklab,var(--color-base-content)_30%,transparent)_transparent]">
          <DrawerBody />
        </aside>
      </div>
    </div>
  )
}
