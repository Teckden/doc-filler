import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { HelpModal } from './HelpModal'
import type { Theme } from '../hooks/useTheme'

type NavbarProps = {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  actions?: ReactNode
}

export const Navbar = ({ theme, onThemeChange, actions }: NavbarProps) => (
  <nav className="flex h-14 shrink-0 items-center gap-2 border-b border-base-300 bg-base-100 px-3 sm:gap-2.5 sm:px-4">
    <div className="flex items-center gap-2.5">
      <div className="grid size-7 place-items-center rounded bg-primary text-[11px] font-bold tracking-tight text-primary-content">
        DF
      </div>
      <span className="text-[13px] font-semibold">DocFiller</span>
    </div>
    <div className="flex-1" />
    <HelpModal />

    {/* Desktop: inline theme switcher */}
    <div className="hidden sm:block">
      <ThemeToggle theme={theme} onChange={onThemeChange} />
    </div>

    {/* Mobile: theme switcher tucked into a hamburger menu */}
    <div className="dropdown dropdown-end sm:hidden">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-ghost btn-sm"
        aria-label="Open menu"
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
        className="dropdown-content z-50 mt-2 w-48 rounded-box border border-base-300 bg-base-100 p-3 shadow-lg"
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider opacity-60">Theme</p>
        <ThemeToggle theme={theme} onChange={onThemeChange} />
      </div>
    </div>

    {actions && <div className="mx-1 hidden h-6 w-px bg-base-300 sm:block" />}
    {actions}
  </nav>
)
