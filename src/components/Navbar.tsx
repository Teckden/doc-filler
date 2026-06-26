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
  <nav className="flex h-14 shrink-0 items-center gap-2.5 border-b border-base-300 bg-base-100 px-4">
    <div className="flex items-center gap-2.5">
      <div className="grid size-7 place-items-center rounded bg-primary text-[11px] font-bold tracking-tight text-primary-content">
        DF
      </div>
      <span className="text-[13px] font-semibold">DocFiller</span>
    </div>
    <div className="flex-1" />
    <HelpModal />
    <ThemeToggle theme={theme} onChange={onThemeChange} />
    {actions && <div className="mx-1 h-6 w-px bg-base-300" />}
    {actions}
  </nav>
)
