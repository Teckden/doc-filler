import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { FieldValuesContext } from './FieldValuesContext'
import { useTemplates } from '../hooks/useTemplates'

export const FieldValuesProvider = ({ children }: { children: ReactNode }) => {
  const { activeTemplate } = useTemplates()
  const resetKey = activeTemplate?.id

  const [values, setValues] = useState<Record<string, string>>({})

  // Reset during render (no effect, no stale frame) when the active template changes.
  const [activeKey, setActiveKey] = useState(resetKey)
  if (resetKey !== activeKey) {
    setActiveKey(resetKey)
    setValues({})
  }

  const setValue = useCallback((field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const reset = useCallback(() => setValues({}), [])

  const value = useMemo(() => ({ values, setValue, reset }), [values, setValue, reset])

  return <FieldValuesContext value={value}>{children}</FieldValuesContext>
}
