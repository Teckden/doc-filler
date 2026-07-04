import { useEffect, useState } from 'react'

const STORAGE_KEY = 'docfiller.previewVisible'

// Whether the live-preview pane is shown. Persisted so the choice survives
// reloads; defaults to visible.
export const usePreviewVisible = () => {
  const [visible, setVisible] = useState(() => localStorage.getItem(STORAGE_KEY) !== '0')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, visible ? '1' : '0')
  }, [visible])

  return [visible, setVisible] as const
}
