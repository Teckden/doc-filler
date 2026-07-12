import { useTranslation } from 'react-i18next'
import { ThemeToggle } from './ThemeToggle'
import { LanguageMenu } from './LanguageMenu'
import { HelpModal } from './HelpModal'
import { TemplateSwitcher } from './TemplateSwitcher'
import { TemplateList } from './TemplateList'
import { ExportButton } from './ExportButton'
import { BookmarkIcon, PanelRightIcon } from './icons'
import { useTheme } from '../hooks/useTheme'
import { useTemplates } from '../hooks/useTemplates'
import { usePresets } from '../hooks/usePresets'
import { useAppState } from '../contexts/AppStateContext'

type NavbarProps = {
  previewVisible: boolean
  onTogglePreview: () => void
}

export const Navbar = ({ previewVisible, onTogglePreview }: NavbarProps) => {
  const { t } = useTranslation()
  const [theme, setTheme] = useTheme()
  const { activeTemplate } = useTemplates()
  const { presets } = usePresets()
  const { openPresetsPanel } = useAppState()

  return (
    <nav className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-base-300 bg-base-100 px-3 sm:gap-2.5 sm:px-4">
      <div className="flex items-center gap-2.5">
        <div className="grid size-7 place-items-center rounded bg-primary text-[11px] font-bold tracking-tight text-primary-content">
          DF
        </div>
        <span className="text-[13px] font-semibold">DocFiller</span>
      </div>

      {activeTemplate && <div className="mx-1 hidden h-6 w-px bg-base-300 sm:block" />}
      <div className="hidden sm:block">{activeTemplate && <TemplateSwitcher />}</div>

      <div className="flex-1" />

      {activeTemplate && (
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-1.5 hidden lg:flex"
          onClick={onTogglePreview}
          title={t(previewVisible ? 'preview.hide' : 'preview.show')}
          aria-pressed={previewVisible}
        >
          <PanelRightIcon className="size-4 opacity-70" />
          <span>{t(previewVisible ? 'preview.hide' : 'preview.show')}</span>
        </button>
      )}

      {activeTemplate && (
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-1.5"
          onClick={() => openPresetsPanel()}
          title={t('presets.title')}
        >
          <BookmarkIcon className="size-4 opacity-70" />
          <span className="hidden lg:inline">{t('presets.button')}</span>
          {presets.length > 0 && (
            <span className="badge badge-neutral badge-xs font-medium tabular-nums">
              {presets.length}
            </span>
          )}
        </button>
      )}

      <HelpModal />
      <LanguageMenu />

      {/* Desktop: inline theme switcher */}
      <div className="hidden sm:block">
        <ThemeToggle theme={theme} onChange={setTheme} />
      </div>

      {/* Mobile: template switching + theme tucked into a hamburger menu */}
      <div className="dropdown dropdown-end sm:hidden">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-circle btn-ghost btn-sm"
          aria-label={t('navbar.openMenu')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </div>
        <div
          tabIndex={0}
          className="dropdown-content z-50 mt-2 max-h-[75vh] w-64 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-3 shadow-lg"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider opacity-60">
            {t('navbar.theme')}
          </p>
          <ThemeToggle theme={theme} onChange={setTheme} />
          {activeTemplate && (
            <>
              <div className="my-3 h-px bg-base-300" />
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider opacity-60">
                {t('navbar.templates')}
              </p>
              <ul className="list">
                <TemplateList />
              </ul>
            </>
          )}
        </div>
      </div>

      {activeTemplate && <div className="mx-1 hidden h-6 w-px bg-base-300 sm:block" />}
      {activeTemplate && (
        <ExportButton
          compact
          className="btn btn-primary btn-sm gap-1.5 font-medium hidden lg:flex"
        />
      )}
    </nav>
  )
}
