import type { Theme } from '../hooks/useTheme'

type ThemeToggleProps = {
  theme: Theme
  onChange: (theme: Theme) => void
}

export const ThemeToggle = ({ theme, onChange }: ThemeToggleProps) => (
  <div className="join overflow-hidden rounded-md border border-base-300">
    <button
      type="button"
      className={`btn join-item btn-sm border-0 ${theme === 'gov-light' ? 'btn-primary' : 'btn-ghost'}`}
      onClick={() => onChange('gov-light')}
      title="Light theme"
    >
      Light
    </button>
    <button
      type="button"
      className={`btn join-item btn-sm border-0 ${theme === 'gov-dark' ? 'btn-primary' : 'btn-ghost'}`}
      onClick={() => onChange('gov-dark')}
      title="Dark theme"
    >
      Dark
    </button>
  </div>
)
