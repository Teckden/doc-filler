import { useEffect, useState } from 'react'

export type Theme = 'gov-light' | 'gov-dark'

const STORAGE_KEY = 'docfiller.theme'
const THEMES: Theme[] = ['gov-light', 'gov-dark']

const readStoredTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return THEMES.includes(stored as Theme) ? (stored as Theme) : 'gov-light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return [theme, setTheme] as const
}
