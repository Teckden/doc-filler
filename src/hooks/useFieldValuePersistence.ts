import { useCallback, useEffect, useState } from 'react'
import { getFieldValues, saveFieldValues, deleteFieldValues } from '../db/templates'

export interface FieldValuePersistence {
  values: Record<string, string>
  setValue: (field: string, value: string) => void
  reset: () => void
}

// React state is the live source of truth (controlled inputs stay snappy, no IDB
// round-trip per keystroke); IndexedDB is a write-through cache hydrated once per
// template switch. Values persist per template across switches and refreshes.
export const useFieldValuePersistence = (activeId: string | undefined): FieldValuePersistence => {
  const [values, setValues] = useState<Record<string, string>>({})

  // Two ids track the switch: `renderedId` clears stale answers synchronously
  // during render so the previous template's values never flash under the new
  // one; `hydratedId` marks `values` as the stored answers for the active id.
  // Write-through only fires while `hydratedId === activeId`, so keystrokes
  // landing in the async load gap can't persist transient state under the new
  // id, and hydration itself doesn't trigger a redundant write.
  const [renderedId, setRenderedId] = useState(activeId)
  const [hydratedId, setHydratedId] = useState<string | undefined>(undefined)
  if (renderedId !== activeId) {
    setRenderedId(activeId)
    setHydratedId(undefined)
    setValues({})
  }

  useEffect(() => {
    if (!activeId) return
    let cancelled = false
    void getFieldValues(activeId).then((stored) => {
      // Discard a read that resolved after the active id changed again.
      if (cancelled) return
      setValues(stored)
      setHydratedId(activeId)
    })
    return () => {
      cancelled = true
    }
  }, [activeId])

  const setValue = useCallback(
    (field: string, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value }
        if (activeId && hydratedId === activeId) void saveFieldValues(activeId, next)
        return next
      })
    },
    [activeId, hydratedId],
  )

  const reset = useCallback(() => {
    setValues({})
    if (activeId) void deleteFieldValues(activeId)
  }, [activeId])

  return { values, setValue, reset }
}
